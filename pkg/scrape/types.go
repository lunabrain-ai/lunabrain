package scrape

type ProcessedVulnerability struct {
	ID         string                `json:"id"`
	Details    string                `json:"details"`
	Summary    string                `json:"summary"`
	References []*ProcessedReference `json:"references"`
}

//type VulnerabilityInfo struct {
//	model.Vulnerability
//	References []model.Reference `json:"references"`
//}
//
//type ReferenceInfo struct {
//	model.Reference
//	VulnDesc string
//}
