package collect

// Replicator is an interface for replicating data from a source to storage.
type Replicator interface {
	Replicate() error
	ReplicateOnSchedule(cron string) error
}
