package util

import (
	"fmt"
	"net/http"
	"os"
	"time"
)

// GenerateFilename generates a filename with the current time.
func GenerateFilename(basename, ext string) string {
	// Get the current time.
	now := time.Now()

	// Format the current time as a string.
	timeStr := now.Format("2006-01-02_15-04-05")

	// Combine the time string with a filename extension.
	filename := fmt.Sprintf("%s-%s.%s", basename, timeStr, ext)

	return filename
}

func DetectFileType(filepath string) (string, error) {
	// Open the file
	file, err := os.Open(filepath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	// Read the first 512 bytes of the file
	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil {
		return "", err
	}

	// Determine the content type
	contentType := http.DetectContentType(buffer)

	return contentType, nil
}
