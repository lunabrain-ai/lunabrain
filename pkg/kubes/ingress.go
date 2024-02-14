package kubes

import (
	"github.com/justshare-io/justshare/pkg/util"
	networkingv1 "k8s.io/api/networking/v1"
)

func NewIngressRule(domain, serviceName string, port int32) *networkingv1.IngressRule {
	return &networkingv1.IngressRule{
		Host: domain,
		IngressRuleValue: networkingv1.IngressRuleValue{
			HTTP: &networkingv1.HTTPIngressRuleValue{
				Paths: []networkingv1.HTTPIngressPath{
					{
						Path:     "/",
						PathType: util.Ptr(networkingv1.PathTypeImplementationSpecific),
						Backend: networkingv1.IngressBackend{
							Service: &networkingv1.IngressServiceBackend{
								Name: serviceName,
								Port: networkingv1.ServiceBackendPort{
									Number: port,
								},
							},
						},
					},
				},
			},
		},
	}
}
