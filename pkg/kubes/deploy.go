package kubes

import (
	"fmt"
	"github.com/lunabrain-ai/lunabrain/pkg/util"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func NewXCtfDeployment(container, name, configMapName string, port int32) *appsv1.Deployment {
	mountDir := "/config"          // Directory where the file will be mounted
	fileName := "gcs_account.json" // Name of the file in the ConfigMap
	mountPath := fmt.Sprintf("%s/%s", mountDir, fileName)

	volumes := []corev1.Volume{
		{
			Name: configMapName,
			VolumeSource: corev1.VolumeSource{
				ConfigMap: &corev1.ConfigMapVolumeSource{
					LocalObjectReference: corev1.LocalObjectReference{
						Name: configMapName,
					},
					Items: []corev1.KeyToPath{
						{
							Key:  fileName,
							Path: fileName,
						},
					},
				},
			},
		},
	}

	volumeMounts := []corev1.VolumeMount{
		{
			Name:      configMapName,
			MountPath: mountPath,
			SubPath:   fileName,
		},
	}
	return &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name: name,
			Labels: map[string]string{
				"app": name,
			},
			Annotations: map[string]string{},
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: util.Ptr[int32](1),
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"app": name,
				},
			},
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"app": name,
					},
					Annotations: map[string]string{},
				},
				Spec: corev1.PodSpec{
					Containers: []corev1.Container{
						{
							Name:  "xctf",
							Image: container,
							Ports: []corev1.ContainerPort{
								{
									ContainerPort: port,
								},
							},
							Env: []corev1.EnvVar{
								{
									Name:  "PORT",
									Value: fmt.Sprintf("%d", port),
								},
								{
									Name:  "PROXY_URL",
									Value: "",
								},
								{
									Name:  "BACKUPS",
									Value: "true",
								},
								{
									Name:  "BACKUP_NAME",
									Value: name,
								},
								{
									Name:  "BUCKET",
									Value: "xctf-backup",
								},
								{
									Name:  "GOOGLE_APPLICATION_CREDENTIALS",
									Value: mountPath,
								},
							},
							VolumeMounts: volumeMounts,
						},
					},
					Volumes: volumes,
					ImagePullSecrets: []corev1.LocalObjectReference{
						{
							Name: "ghcr-pull-secret",
						},
					},
					RestartPolicy: corev1.RestartPolicyAlways,
				},
			},
		},
	}
}
