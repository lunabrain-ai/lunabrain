package kubes

import (
	"context"
	"fmt"
	"github.com/bufbuild/connect-go"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/kubes"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/kubes/kubesconnect"
	corev1 "k8s.io/api/core/v1"
	networkingv1 "k8s.io/api/networking/v1"
	"log/slog"
	"os"
	"path/filepath"
	"regexp"

	appsv1 "k8s.io/api/apps/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"
)

var ProviderSet = wire.NewSet(
	New,
	NewConfig,
)

type Service struct {
	c         Config
	clientSet *kubernetes.Clientset
}

var _ kubesconnect.KubesServiceHandler = (*Service)(nil)

func New(c Config) (*Service, error) {
	if !c.Enabled {
		return nil, nil
	}

	kubeconfig := filepath.Join(homedir.HomeDir(), ".kube", "config")

	// Build the configuration from the kubeconfig
	config, err := clientcmd.BuildConfigFromFlags("", kubeconfig)
	if err != nil {
		return nil, err
	}

	// Create a clientset for interacting with the Kubernetes cluster
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return nil, err
	}
	return &Service{
		c:         c,
		clientSet: clientset,
	}, nil
}

func (s *Service) ListDeployments(ctx context.Context, c *connect.Request[kubes.ListDeploymentsRequest]) (*connect.Response[kubes.ListDeploymentsResponse], error) {
	deployments, err := s.deploymentsForNamespace(ctx, s.c.DefaultNamespace)
	if err != nil {
		return nil, err
	}

	var deploymentList []*kubes.Deployment
	for _, deployment := range deployments.Items {
		deploymentList = append(deploymentList, &kubes.Deployment{
			Id:        string(deployment.UID),
			Name:      deployment.Name,
			Namespace: deployment.Namespace,
			Image:     deployment.Spec.Template.Spec.Containers[0].Image,
			Replicas:  *deployment.Spec.Replicas,
			Status:    deployment.Status.String(),
		})
	}

	return connect.NewResponse(&kubes.ListDeploymentsResponse{
		Deployments: deploymentList,
	}), nil
}

func isValidK8sServiceName(name string) bool {
	if len(name) == 0 || len(name) > 63 {
		return false
	}

	// Kubernetes service names must conform to RFC 1123. This includes the DNS label standard,
	// which requires the name to consist of only lowercase alphanumeric characters or '-',
	// and must start and end with an alphanumeric character.
	match, _ := regexp.MatchString("^[a-z0-9]([-a-z0-9]*[a-z0-9])?$", name)

	return match
}

func deploymentName(name string) string {
	return fmt.Sprintf("%s-xctf", name)
}

func hostName(name string) string {
	// TODO breadchris make this domain configurable
	return fmt.Sprintf("%s.nicek12.xctf.io", name)
}

func serviceName(name string) string {
	return fmt.Sprintf("%s-svc", name)
}

func (s *Service) NewDeployment(ctx context.Context, c *connect.Request[kubes.NewDeploymentRequest]) (*connect.Response[kubes.NewDeploymentResponse], error) {
	port := int32(80)
	name := deploymentName(c.Msg.Name)
	service := serviceName(name)
	domain := hostName(name)
	namespace := s.c.DefaultNamespace

	if c.Msg.DomainName != "" {
		domain = c.Msg.DomainName
	}

	if !isValidK8sServiceName(name) {
		return nil, fmt.Errorf("invalid service name: %s", name)
	}

	configMapName := "gcs-config"
	b, err := os.ReadFile(s.c.GcsAccount)
	if err != nil {
		return nil, err
	}
	gcsAccount := map[string]string{
		"gcs_account.json": string(b),
	}
	err = createConfigMap(s.clientSet, namespace, configMapName, gcsAccount)
	if err != nil {
		return nil, err
	}

	slog.Debug("creating deployment", "name", name, "namespace", namespace, "image", s.c.Container)
	_, err = s.newDeployment(ctx, namespace, NewXCtfDeployment(s.c.Container, name, configMapName, port))
	if err != nil {
		return nil, err
	}

	err = createService(s.clientSet, service, name, namespace)
	if err != nil {
		return nil, err
	}

	err = s.updateIngress(ctx, namespace, s.c.DefaultIngress, NewIngressRule(domain, service, port))
	if err != nil {
		return nil, err
	}
	return connect.NewResponse(&kubes.NewDeploymentResponse{}), nil
}

func (s *Service) DeleteDeployment(ctx context.Context, c *connect.Request[kubes.DeleteDeploymentRequest]) (*connect.Response[kubes.DeleteDeploymentResponse], error) {
	name := c.Msg.Name
	domain := hostName(name)
	namespace := s.c.DefaultNamespace

	// TODO breadchris domain name should be set on label of deployment
	if c.Msg.DomainName != "" {
		domain = c.Msg.DomainName
	}

	err := s.deleteDeployment(s.clientSet, namespace, name)
	if err != nil {
		return nil, err
	}

	err = s.deleteService(ctx, serviceName(name), namespace)
	if err != nil {
		return nil, err
	}

	err = s.removeIngressRule(ctx, namespace, s.c.DefaultIngress, domain)
	if err != nil {
		return nil, err
	}
	return connect.NewResponse(&kubes.DeleteDeploymentResponse{}), nil
}

func createService(clientset *kubernetes.Clientset, serviceName, deploymentName, namespace string) error {
	service := &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name: serviceName,
		},
		Spec: corev1.ServiceSpec{
			Selector: map[string]string{
				"app": deploymentName,
			},
			Ports: []corev1.ServicePort{
				{
					Port: 80,
				},
			},
			Type: corev1.ServiceTypeClusterIP,
		},
	}

	_, err := clientset.CoreV1().Services(namespace).Create(context.TODO(), service, metav1.CreateOptions{})
	if err != nil {
		return err
	}
	return nil
}

func (s *Service) deleteService(ctx context.Context, serviceName, namespace string) error {
	deletePolicy := metav1.DeletePropagationForeground
	err := s.clientSet.CoreV1().Services(namespace).Delete(ctx, serviceName, metav1.DeleteOptions{
		PropagationPolicy: &deletePolicy,
	})
	return err
}

func (s *Service) deleteDeployment(clientset *kubernetes.Clientset, namespace string, deploymentName string) error {
	deletePolicy := metav1.DeletePropagationForeground
	return clientset.AppsV1().Deployments(namespace).Delete(context.TODO(), deploymentName, metav1.DeleteOptions{
		PropagationPolicy: &deletePolicy,
	})
}

func (s *Service) deploymentsForNamespace(ctx context.Context, namespace string) (*appsv1.DeploymentList, error) {
	deploymentsClient := s.clientSet.AppsV1().Deployments(namespace)
	return deploymentsClient.List(ctx, metav1.ListOptions{})
}

func (s *Service) newDeployment(ctx context.Context, namespace string, deployment *appsv1.Deployment) (*appsv1.Deployment, error) {
	deploymentsClient := s.clientSet.AppsV1().Deployments(namespace)
	return deploymentsClient.Create(ctx, deployment, metav1.CreateOptions{})
}

func (s *Service) updateIngress(ctx context.Context, namespace, ingressName string, ingressRule *networkingv1.IngressRule) error {
	ingress, err := s.clientSet.NetworkingV1().Ingresses(namespace).Get(ctx, ingressName, metav1.GetOptions{})
	if err != nil {
		return err
	}

	// TODO breadchris check if rule already exists?
	ingress.Spec.Rules = append(ingress.Spec.Rules, *ingressRule)

	// TODO breadchris check if host already exists?
	hosts := ingress.Spec.TLS[0].Hosts
	hosts = append(hosts, ingressRule.Host)
	ingress.Spec.TLS[0].Hosts = hosts

	_, err = s.clientSet.NetworkingV1().Ingresses(namespace).Update(ctx, ingress, metav1.UpdateOptions{})
	return err
}

func (s *Service) removeIngressRule(ctx context.Context, namespace, ingressName, hostToRemove string) error {
	ingress, err := s.clientSet.NetworkingV1().Ingresses(namespace).Get(ctx, ingressName, metav1.GetOptions{})
	if err != nil {
		return err
	}

	var updatedRules []networkingv1.IngressRule
	for _, rule := range ingress.Spec.Rules {
		if rule.Host != hostToRemove {
			updatedRules = append(updatedRules, rule)
		}
	}
	ingress.Spec.Rules = updatedRules

	var updatedTLS []networkingv1.IngressTLS
	for _, tls := range ingress.Spec.TLS {
		var hosts []string
		for _, host := range tls.Hosts {
			if host != hostToRemove {
				hosts = append(hosts, host)
			}
		}
		tls.Hosts = hosts
		updatedTLS = append(updatedTLS, tls)
	}
	ingress.Spec.Rules = updatedRules
	ingress.Spec.TLS = updatedTLS

	_, err = s.clientSet.NetworkingV1().Ingresses(namespace).Update(ctx, ingress, metav1.UpdateOptions{})
	return err
}
