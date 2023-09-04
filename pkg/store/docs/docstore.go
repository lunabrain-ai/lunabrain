package docs

import (
	"github.com/lunabrain-ai/lunabrain/pkg/store/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db/model"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"reflect"
	"strings"
	"unicode"
)

type DocStore[T any] interface {
	SaveDocument(data *T) (*T, error)
	GetDocument(expression *datatypes.JSONQueryExpression) (*T, error)
	GetDocuments(expression *datatypes.JSONQueryExpression) ([]T, error)
}

type docStore[T any] struct {
	db        *gorm.DB
	tableName string
}

func toSnakeCase(s string) string {
	var result strings.Builder

	for i, r := range s {
		if unicode.IsUpper(r) {
			if i > 0 {
				result.WriteRune('_')
			}
			result.WriteRune(unicode.ToLower(r))
		} else {
			result.WriteRune(r)
		}
	}

	return result.String()
}

func typeString[T any](t T) string {
	name := reflect.TypeOf(t).Name()
	// make sure name is in the form: table_name
	return toSnakeCase(name)
}

var _ DocStore[interface{}] = (*docStore[interface{}])(nil)

func NewDocStore[T any](c db.Config, bucket *bucket.Bucket) (*docStore[T], error) {
	db, err := db.NewGormDB(c, bucket)
	if err != nil {
		return nil, errors.Wrapf(err, "could not connect to database: %v", err)
	}

	// TODO breadchris migration should be done via a migration tool, no automigrate
	log.Info().Msg("migrating database")
	var t T
	m := model.BaseDoc[T]{}
	tableName := typeString[T](t)
	err = db.Debug().Table(tableName).AutoMigrate(&m)
	if err != nil {
		return nil, errors.Wrapf(err, "could not migrate database: %v", err)
	}
	return &docStore[T]{
		db:        db,
		tableName: tableName,
	}, nil
}

func (s *docStore[T]) SaveDocument(data *T) (*T, error) {
	doc := &model.BaseDoc[T]{
		Doc: datatypes.JSONType[T]{
			Data: *data,
		},
	}
	res := s.db.Table(s.tableName).Create(doc)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not save document")
	}
	return &doc.Doc.Data, nil
}

func (s *docStore[T]) GetDocument(expression *datatypes.JSONQueryExpression) (*T, error) {
	var document model.BaseDoc[T]
	res := s.db.Table(s.tableName).First(&document, expression)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get document")
	}
	return &document.Doc.Data, nil
}

func (s *docStore[T]) GetDocuments(expression *datatypes.JSONQueryExpression) ([]T, error) {
	var document []model.BaseDoc[T]
	res := s.db.Table(s.tableName).Find(&document, expression)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get document")
	}
	var docs []T
	for _, doc := range document {
		docs = append(docs, doc.Doc.Data)
	}
	return docs, nil
}
