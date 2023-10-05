package normalize

import "regexp"

func ParseGitHubURL(url string) (string, string) {
	// Define the regular expression to match the user and repo name from the GitHub URL
	re := regexp.MustCompile(`^https://github.com/([^/]+)/([^/]+)`)

	// Find the first match of the regular expression in the URL
	match := re.FindStringSubmatch(url)

	if len(match) == 0 {
		return "", ""
	}

	// Return the user and repo name as separate strings
	return match[1], match[2]
}
