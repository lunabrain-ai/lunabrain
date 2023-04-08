package workflowmanager

type WorkflowManagerConfig struct {
	TemporalHostPort string `yaml:"temporal_host_port"`
	DatabaseURI      string `yaml:"database_uri"`
}

type WorkflowToDSLLookup map[string]string

type WorkflowResult struct {
	Data  string
	Error error
}
