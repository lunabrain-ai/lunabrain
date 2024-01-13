package util

import (
	"fmt"
	"github.com/iancoleman/strcase"
)

func SnakeToCamelCase(input any) (any, error) {
	switch input := input.(type) {
	case map[any]any:
		newMap := make(map[any]any)
		for key, value := range input {
			strKey, ok := key.(string)
			if !ok {
				return nil, fmt.Errorf("non-string key found in map")
			}
			newKey := strcase.ToCamel(strKey)
			newValue, err := SnakeToCamelCase(value)
			if err != nil {
				return nil, err
			}
			newMap[newKey] = newValue
		}
		return newMap, nil
	case []any:
		for i, v := range input {
			newValue, err := SnakeToCamelCase(v)
			if err != nil {
				return nil, err
			}
			input[i] = newValue
		}
	}
	return input, nil
}
