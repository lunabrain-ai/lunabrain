package model

import "gorm.io/datatypes"

type Document[T any] struct {
	Base

	Collection string
	Content    datatypes.JSONType[T]
}
