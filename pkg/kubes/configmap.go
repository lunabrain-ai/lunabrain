package kubes

import (
	"context"
	"fmt"
	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func createConfigMap(clientset *kubernetes.Clientset, namespace, configMapName string, data map[string]string) error {
	configMap := &v1.ConfigMap{
		ObjectMeta: metav1.ObjectMeta{
			Name:      configMapName,
			Namespace: namespace,
		},
		Data: data,
	}

	existingConfigMap, err := clientset.CoreV1().ConfigMaps(namespace).Get(context.TODO(), configMapName, metav1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			_, err := clientset.CoreV1().ConfigMaps(namespace).Create(context.TODO(), configMap, metav1.CreateOptions{})
			if err != nil {
				return fmt.Errorf("error creating ConfigMap: %w", err)
			}
		} else {
			return fmt.Errorf("error getting ConfigMap: %w", err)
		}
	} else {
		existingConfigMap.Data = data
		_, err = clientset.CoreV1().ConfigMaps(namespace).Update(context.TODO(), existingConfigMap, metav1.UpdateOptions{})
		if err != nil {
			return fmt.Errorf("error updating ConfigMap: %w", err)
		}
	}

	return nil
}
