package model

import (
	"context"
	"database/sql/driver"
	"errors"
	"fmt"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content"
	"strings"

	"google.golang.org/protobuf/encoding/protojson"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"gorm.io/gorm/schema"
)

// ContentData give a generic data type for json encoded data.
type ContentData struct {
	// TODO breadchris couldn't figure out how to make this generic, there is a problem with protojson.Unmarshal/Marshal
	Data *content.Content
}

// Value return json value, implement driver.Valuer interface
func (j *ContentData) Value() (driver.Value, error) {
	return j.MarshalJSON()
}

// Scan scan value into ContentData[T], implements sql.Scanner interface
func (j *ContentData) Scan(value interface{}) error {
	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		return errors.New(fmt.Sprint("Failed to unmarshal JSONB value:", value))
	}

	return j.UnmarshalJSON(bytes)
}

func (j *ContentData) MarshalJSON() ([]byte, error) {
	marshaler := &protojson.MarshalOptions{}
	b, err := marshaler.Marshal(j.Data)
	if err != nil {
		return nil, err
	}
	return b, nil
}

func (j *ContentData) UnmarshalJSON(data []byte) error {
	unmarshaler := protojson.UnmarshalOptions{DiscardUnknown: true}

	if j.Data == nil {
		j.Data = &content.Content{}
	}

	if err := unmarshaler.Unmarshal(data, j.Data); err != nil {
		return err
	}
	return nil
}

// GormDataType gorm common data type
func (*ContentData) GormDataType() string {
	return "json"
}

// GormDBDataType gorm db data type
func (*ContentData) GormDBDataType(db *gorm.DB, field *schema.Field) string {
	switch db.Dialector.Name() {
	case "sqlite":
		return "JSON"
	case "mysql":
		return "JSON"
	case "postgres":
		return "JSONB"
	}
	return ""
}

func (j *ContentData) GormValue(ctx context.Context, db *gorm.DB) clause.Expr {
	if j == nil {
		return clause.Expr{SQL: "NULL"}
	}
	data, _ := j.MarshalJSON()

	switch db.Dialector.Name() {
	case "mysql":
		if v, ok := db.Dialector.(*mysql.Dialector); ok && !strings.Contains(v.ServerVersion, "MariaDB") {
			return gorm.Expr("CAST(? AS JSON)", string(data))
		}
	}

	return gorm.Expr("?", string(data))
}
