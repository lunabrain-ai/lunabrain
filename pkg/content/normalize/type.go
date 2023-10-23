package normalize

import "encoding/json"

func NewChatGPTResponse(data []byte) (ChatGPTResponse, error) {
	var r ChatGPTResponse
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *ChatGPTResponse) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type ChatGPTResponse struct {
	Props        Props         `json:"props"`
	Page         string        `json:"page"`
	Query        Query         `json:"query"`
	BuildID      string        `json:"buildId"`
	AssetPrefix  string        `json:"assetPrefix"`
	IsFallback   bool          `json:"isFallback"`
	Gssp         bool          `json:"gssp"`
	ScriptLoader []interface{} `json:"scriptLoader"`
}

type Props struct {
	PageProps PageProps `json:"pageProps"`
	NSSP      bool      `json:"__N_SSP"`
}

type PageProps struct {
	SharedConversationID string         `json:"sharedConversationId"`
	ServerResponse       ServerResponse `json:"serverResponse"`
	ContinueMode         bool           `json:"continueMode"`
	ModerationMode       bool           `json:"moderationMode"`
	Plugins              interface{}    `json:"plugins"`
	ChatPageProps        ChatPageProps  `json:"chatPageProps"`
}

type ChatPageProps struct {
}

type ServerResponse struct {
	Type string `json:"type"`
	Data Data   `json:"data"`
}

type Data struct {
	Title                   string               `json:"title"`
	CreateTime              float64              `json:"create_time"`
	UpdateTime              int64                `json:"update_time"`
	Mapping                 map[string]RespMsg   `json:"mapping"`
	ModerationResults       []interface{}        `json:"moderation_results"`
	CurrentNode             string               `json:"current_node"`
	ConversationID          string               `json:"conversation_id"`
	IsPublic                bool                 `json:"is_public"`
	LinearConversation      []LinearConversation `json:"linear_conversation"`
	HasUserEditableContext  bool                 `json:"has_user_editable_context"`
	ContinueConversationURL string               `json:"continue_conversation_url"`
	Model                   Model                `json:"model"`
	ModerationState         ModerationState      `json:"moderation_state"`
}

type LinearConversation struct {
	ID       string                     `json:"id"`
	Children []string                   `json:"children"`
	Message  *LinearConversationMessage `json:"message,omitempty"`
	Parent   *string                    `json:"parent,omitempty"`
}

type MsgAuthor struct {
	Role     Role          `json:"role"`
	Metadata ChatPageProps `json:"metadata"`
}

type Content struct {
	ContentType ContentType `json:"content_type"`
	Parts       []string    `json:"parts"`
}

type FinishDetails struct {
	Type       string  `json:"type"`
	StopTokens []int64 `json:"stop_tokens"`
}

type RespMsg struct {
	ID       string                    `json:"id"`
	Message  LinearConversationMessage `json:"message"`
	Parent   string                    `json:"parent"`
	Children []string                  `json:"children"`
}

type LinearConversationMessage struct {
	ID         string         `json:"id"`
	Author     MsgAuthor      `json:"author"`
	Content    Content        `json:"content"`
	Status     string         `json:"status"`
	EndTurn    *bool          `json:"end_turn,omitempty"`
	Weight     int64          `json:"weight"`
	Metadata   PurpleMetadata `json:"metadata"`
	Recipient  string         `json:"recipient"`
	CreateTime *float64       `json:"create_time,omitempty"`
}

type PurpleMetadata struct {
	SharedConversationID string         `json:"shared_conversation_id"`
	Timestamp            *string        `json:"timestamp_,omitempty"`
	FinishDetails        *FinishDetails `json:"finish_details,omitempty"`
	IsComplete           *bool          `json:"is_complete,omitempty"`
	ModelSlug            *string        `json:"model_slug,omitempty"`
	ParentID             *string        `json:"parent_id,omitempty"`
}

type TentacledMetadata struct {
	SharedConversationID string `json:"shared_conversation_id"`
}

type Model struct {
	Slug        string   `json:"slug"`
	MaxTokens   int64    `json:"max_tokens"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Tags        []string `json:"tags"`
}

type ModerationState struct {
	HasBeenModerated     bool `json:"has_been_moderated"`
	HasBeenBlocked       bool `json:"has_been_blocked"`
	HasBeenAccepted      bool `json:"has_been_accepted"`
	HasBeenAutoBlocked   bool `json:"has_been_auto_blocked"`
	HasBeenAutoModerated bool `json:"has_been_auto_moderated"`
}

type Query struct {
	ShareParams []string `json:"shareParams"`
}

type Role string

const (
	Assistant Role = "assistant"
	System    Role = "system"
	User      Role = "user"
)

type ContentType string

const (
	Text ContentType = "text"
)
