package sync

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
)

func WatchForUrls(notesDir string) error {
	urlRegex := regexp.MustCompile(`\[(.*?)\]\((http.*?)(\)|$)`) // regular expression to match Markdown URLs

	return filepath.Walk(notesDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Println("Error:", err)
			return err
		}
		if info.IsDir() {
			return nil
		}
		if filepath.Ext(path) == ".md" { // only process Markdown files
			file, err := os.Open(path)
			if err != nil {
				fmt.Println("Error:", err)
				return err
			}
			defer file.Close()

			scanner := bufio.NewScanner(file)
			for scanner.Scan() {
				line := scanner.Text()
				matches := urlRegex.FindStringSubmatch(line)
				if len(matches) > 0 {
					processURL(matches[2])
				}
			}
			if err := scanner.Err(); err != nil {
				fmt.Println("Error:", err)
				return err
			}
		}
		return nil
	})
}

func processURL(url string) {
	fmt.Println("Processing URL:", url)
	// do something with the URL
}
