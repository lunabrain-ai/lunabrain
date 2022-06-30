package types

type RecoveryAddress struct {
	CreatedAt string `json:"created_at"`
	ID        string `json:"id"`
	UpdatedAt string `json:"updated_at"`
	Value     string `json:"value"`
	Via       string `json:"via"`
}

type Traits struct {
	Email string `json:"email"`
}

type VerifiableAddress struct {
	CreatedAt string `json:"created_at"`
	ID        string `json:"id"`
	Status    string `json:"status"`
	UpdatedAt string `json:"updated_at"`
	Value     string `json:"value"`
	Verified  bool   `json:"verified"`
	Via       string `json:"via"`
}

type Identity struct {
	CreatedAt           string              `json:"created_at"`
	ID                  string              `json:"id"`
	RecoveryAddresses   []RecoveryAddress   `json:"recovery_addresses"`
	SchemaID            string              `json:"schema_id"`
	SchemaURL           string              `json:"schema_url"`
	State               string              `json:"state"`
	StateChangedAt      string              `json:"state_changed_at"`
	Traits              Traits              `json:"traits"`
	UpdatedAt           string              `json:"updated_at"`
	VerifiableAddresses []VerifiableAddress `json:"verifiable_addresses"`
}
