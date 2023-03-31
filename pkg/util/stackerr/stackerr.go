package stackerr

import "fmt"

type StackError struct {
	Err error
}

func (e *StackError) Error() string {
	return fmt.Sprintf(e.Err.Error())
}

func New(err error) *StackError {
	return &StackError{Err: err}
}
