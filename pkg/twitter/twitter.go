package twitter

type Twitter struct {
}

func New(cfg Config) (*Twitter, error) {
	return &Twitter{}, nil
}
