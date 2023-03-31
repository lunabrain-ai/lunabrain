package content

import (
	"context"
	"fmt"
	"google.golang.org/api/option"
	"google.golang.org/api/youtube/v3"
	"io"
	"net/url"
	"strings"
)

// TODO breadchris API tokens don't seem to work for this API anymore, figure out why

// GetYouTubeTranscript fetches the transcript for the specified video ID.
func GetYouTubeTranscript(videoID string, apiKey string) (string, error) {
	// Set up the YouTube API client
	ctx := context.Background()
	youtubeService, err := youtube.NewService(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return "", fmt.Errorf("failed to create YouTube client: %v", err)
	}

	// Fetch the video caption track
	captions, err := youtubeService.Captions.List([]string{"snippet"}, videoID).Do()
	if err != nil {
		return "", fmt.Errorf("failed to get captions: %v", err)
	}

	// Check if the video has captions
	if len(captions.Items) == 0 {
		return "", fmt.Errorf("video has no captions")
	}

	// Fetch the caption track content
	download, err := youtubeService.Captions.Download(captions.Items[0].Id).Download()
	if err != nil {
		return "", fmt.Errorf("failed to download caption track: %v", err)
	}

	downloadBytes, err := io.ReadAll(download.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read caption track: %v", err)
	}
	captionTrack := string(downloadBytes)

	// Return the caption track content as a string
	return captionTrack, nil
}

func ExtractVideoID(parsedURL *url.URL) string {
	if parsedURL.Host != "www.youtube.com" {
		return ""
	}

	if parsedURL.Path != "/watch" {
		return ""
	}

	query := parsedURL.Query()

	if query.Get("v") == "" {
		return ""
	}

	return strings.TrimSpace(query.Get("v"))
}
