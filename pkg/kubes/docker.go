package kubes

import (
	docker "github.com/fsouza/go-dockerclient"
)

func pullDockerImageAndGetSHA(imageName string) (string, error) {
	client, err := docker.NewClientFromEnv()
	if err != nil {
		return "", err
	}
	err = client.PullImage(docker.PullImageOptions{
		Repository: imageName,
		Tag:        "latest",
	}, docker.AuthConfiguration{})
	if err != nil {
		return "", err
	}

	img, err := client.InspectImage(imageName)
	if err != nil {
		return "", err
	}
	return img.ID, nil
}
