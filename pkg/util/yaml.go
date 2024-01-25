package util

import (
	"github.com/iancoleman/strcase"
)

func SnakeToCamelCase(input any) any {
	switch i := input.(type) {
	case map[string]any:
		newMap := make(map[any]any)
		for key, value := range i {
			/*
				TODO breadchris
				the proto structure is this
				 outputs:
					 home:
						 values: ...
				but it is expected to be
				 outputs:
					 home: ...
			*/
			if key == "items" || key == "values" {
				return SnakeToCamelCase(value)
			}
			newKey := strcase.ToLowerCamel(key)
			newMap[newKey] = SnakeToCamelCase(value)
		}
		return newMap
	case []any:
		for n, v := range i {
			i[n] = SnakeToCamelCase(v)
		}
	}
	return input
}
