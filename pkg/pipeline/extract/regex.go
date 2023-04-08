package extract

type Regexer interface {
	Extract() error
}

type Regex struct {
}

func (r *Regex) Extract() error {
	return nil
}

func NewRegex() *Regex {
	return &Regex{}
}
