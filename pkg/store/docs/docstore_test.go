package docs

import (
	"github.com/lunabrain-ai/lunabrain/pkg/store"
	"gorm.io/datatypes"
	"testing"
)

func TestTableName(t *testing.T) {
	type test1Name struct{}

	type OtherName struct{}

	var typ test1Name
	name := typeString[test1Name](typ)
	if name != "test1_name" {
		t.Fatal("table name should be 'test1_name'", name)
	}
}

func TestNewDocStore(t *testing.T) {
	cache, err := store.NewLocalCache()
	if err != nil {
		t.Fatal(err)
	}

	type data struct {
		Name string
	}

	docstore, err := NewDocStore[data](cache)
	if err != nil {
		t.Fatal(err)
	}

	d := data{Name: "test"}
	m, err := docstore.SaveDocument(&d)
	if err != nil {
		t.Fatal(err)
	}
	println(m.Name)

	res, err := docstore.GetDocument(datatypes.JSONQuery("doc").Equals("test", "Name"))
	if err != nil {
		t.Fatal(err)
	}
	println(res.Name)
}
