package types

type KratosHydrateRequest struct {
	Ctx Ctx `json:"ctx"`
}

type Ctx struct {
	Flow           Flow                `json:"flow"`
	Identity       Identity            `json:"identity"`
	RequestHeaders map[string][]string `json:"request_headers"`
	RequestMethod  string              `json:"request_method"`
	RequestURL     string              `json:"request_url"`
}

type Flow struct {
	Active       string `json:"active"`
	CreatedAt    string `json:"created_at"`
	ExpiresAt    string `json:"expires_at"`
	ID           string `json:"id"`
	IssuedAt     string `json:"issued_at"`
	Refresh      bool   `json:"refresh"`
	RequestURL   string `json:"request_url"`
	RequestedAAL string `json:"requested_aal"`
	Type         string `json:"type"`
	UI           UI     `json:"ui"`
	UpdatedAt    string `json:"updated_at"`
}

type UI struct {
	Action string `json:"action"`
	Method string `json:"method"`
	Nodes  []Node `json:"nodes"`
}

type Node struct {
	Attributes Attributes    `json:"attributes"`
	Group      string        `json:"group"`
	Messages   []interface{} `json:"messages"`
	Meta       Meta          `json:"meta"`
	Type       string        `json:"type"`
}

type Attributes struct {
	Disabled bool   `json:"disabled"`
	Name     string `json:"name"`
	NodeType string `json:"node_type"`
	Type     string `json:"type"`
	Value    string `json:"value"`
	Required *bool  `json:"required,omitempty"`
}

type Meta struct {
	Label *Label `json:"label,omitempty"`
}

type Label struct {
	Context Context `json:"context"`
	ID      int64   `json:"id"`
	Text    string  `json:"text"`
	Type    string  `json:"type"`
}

type Context struct {
	Provider string `json:"provider"`
}
