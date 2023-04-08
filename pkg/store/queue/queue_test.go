package queue

import (
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"os"
	"testing"
	"time"
)

var testResult []string

func TestJournal(t *testing.T) {
	assert := assert.New(t)
	file, err := ioutil.TempFile(os.TempDir(), "journal")
	assert.NoError(err)
	defer os.Remove(file.Name())

	assert.NoError(Start(file.Name(), testSubmit))

	Add([]byte("foo"))
	waitForResultCount(1)

	Add([]byte("bar"))
	waitForResultCount(2)

	Stop()

	assert.EqualValues([]string{"foo", "bar"}, testResult)
}

func waitForResultCount(expected int) {
	for i := 0; len(testResult) != expected && i < 1000; i++ {
		time.Sleep(time.Millisecond)
	}
}

func testSubmit(entries []Entry) bool {
	for _, entry := range entries {
		testResult = append(testResult, string(entry.Data))
	}
	return true
}
