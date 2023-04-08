package util

func Ptr[T any](t T) *T {
	return &t
}

// DerefOr0 converts nil pointers to the zero value of their type.
func DerefOr0[T any](a *T) T {
	if a != nil {
		return *a
	}
	return *new(T)
}
