package types

import "encoding/json"

type OathkeeperHydrateRequest struct {
	Subject      string          `json:"subject"`
	Extra        Extra           `json:"extra"`
	Header       json.RawMessage `json:"header"`
	MatchContext MatchContext    `json:"match_context"`
}

type Extra struct {
	Active                      bool                   `json:"active"`
	AuthenticatedAt             string                 `json:"authenticated_at"`
	AuthenticationMethods       []AuthenticationMethod `json:"authentication_methods"`
	AuthenticatorAssuranceLevel string                 `json:"authenticator_assurance_level"`
	ExpiresAt                   string                 `json:"expires_at"`
	ID                          string                 `json:"id"`
	Identity                    Identity               `json:"identity"`
	IssuedAt                    string                 `json:"issued_at"`
	UserId                      string                 `json:"user_id"`
}

type AuthenticationMethod struct {
	AAL         string `json:"aal"`
	CompletedAt string `json:"completed_at"`
	Method      string `json:"method"`
}

type MatchContext struct {
	RegexpCaptureGroups []string            `json:"regexp_capture_groups"`
	URL                 URL                 `json:"url"`
	Method              string              `json:"method"`
	Header              map[string][]string `json:"header"`
}

type URL struct {
	Scheme      string      `json:"Scheme"`
	Opaque      string      `json:"Opaque"`
	User        interface{} `json:"User"`
	Host        string      `json:"Host"`
	Path        string      `json:"Path"`
	RawPath     string      `json:"RawPath"`
	ForceQuery  bool        `json:"ForceQuery"`
	RawQuery    string      `json:"RawQuery"`
	Fragment    string      `json:"Fragment"`
	RawFragment string      `json:"RawFragment"`
}
