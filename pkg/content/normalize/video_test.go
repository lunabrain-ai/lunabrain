package normalize

import "testing"

func TestCutVideoSection(t *testing.T) {
	err := cutVideoSection("/tmp/test.mp4", "/tmp/test_trim.mp4", 1, 1)
	if err != nil {
		t.Error(err)
	}
}
