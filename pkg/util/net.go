package util

import (
	"fmt"
	"strings"
)

func RemoveSubdomains(urlHost string) (string, error) {
	parts := strings.Split(urlHost, ".")

	if len(parts) < 2 {
		return "", fmt.Errorf("invalid URL host")
	}

	// Handling special cases for ccTLDs
	if len(parts) > 2 {
		domain := parts[len(parts)-2]
		tld := parts[len(parts)-1]
		ccTLDs := map[string]struct{}{
			"uk": {},
			"au": {},
			"br": {},
			// ... (add other ccTLDs that often have second-level domains)
		}
		if _, exists := ccTLDs[tld]; exists {
			domain = parts[len(parts)-3]
		}

		return fmt.Sprintf("%s.%s", domain, tld), nil
	}

	return urlHost, nil
}
