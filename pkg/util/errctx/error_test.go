package errctx

import (
	"fmt"
	"github.com/pkg/errors"
	"testing"
)

func TestError(t *testing.T) {
	err := errors.New("test")
	newErr := errors.Wrapf(err, "test2 %s", "test3")

	fmt.Printf("%+v\n", newErr)
}
