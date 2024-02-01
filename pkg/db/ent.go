package db

import (
	"context"
	"github.com/benbjohnson/litestream"
	lsgcs "github.com/benbjohnson/litestream/gcs"
	"github.com/lunabrain-ai/lunabrain/pkg/ent"
	"github.com/lunabrain-ai/lunabrain/pkg/ent/migrate"
	"log/slog"
	"os"
)

func NewEnt(c Config) (*ent.Client, error) {
	logFn := func(params ...any) {
		slog.Debug("ent", params)
	}
	// TODO breadchris this should depend on a bucket config and the dsn changes based on the bucket config
	var lsdb *litestream.DB
	if c.BackupsEnabled {
		lsdb = litestream.NewDB(c.DSN)

		if err := lsdb.Open(); err != nil {
			return nil, err
		}
		replica := newReplica(c, lsdb)
		lsdb.Replicas = append(lsdb.Replicas, replica)
		if err := restore(context.Background(), replica); err != nil {
			return nil, err
		}
	}

	client, err := ent.Open(
		c.Type,
		c.DSN,
		ent.Log(logFn),
		ent.Debug(),
	)
	if err != nil {
		return nil, err
	}

	// TODO breadchris this was needed for gorm, is this needed for ent?
	// TODO breadchris gorm must be created after a replication attempt so that an empty database isn't create
	// TODO breadchris database instantiation should be generic
	if c.BackupsEnabled {
		client.Use(func(next ent.Mutator) ent.Mutator {
			return replicateDBHook(next, lsdb)
		})
	}

	err = client.Schema.Create(context.Background(),
		// TODO breadchris do not configure this for production
		// use https://entgo.io/docs/versioned-migrations
		migrate.WithDropIndex(true),
		migrate.WithDropColumn(true),
	)
	return client, err
}

func replicateDBHook(next ent.Mutator, lsdb *litestream.DB) ent.Mutator {
	return ent.MutateFunc(func(ctx context.Context, m ent.Mutation) (ent.Value, error) {
		// Call the next mutator in the chain. This will execute the actual database operation.
		v, err := next.Mutate(ctx, m)
		if err != nil {
			return nil, err
		}

		// Assuming `lsdb` is your litestream.DB instance, and it's accessible in this context.
		slog.Debug("replicating DB")
		if err := lsdb.Sync(ctx); err != nil {
			slog.Error("failed to sync WAL")
			return nil, err
		}
		if err := lsdb.Replicas[0].Sync(ctx); err != nil {
			slog.Error("failed to backup DB")
			return nil, err
		}

		// Return the result of the mutation.
		return v, nil
	})
}

func newReplica(c Config, lsdb *litestream.DB) *litestream.Replica {
	// TODO breadchris support gcs https://litestream.io/guides/gcs/
	rc := lsgcs.NewReplicaClient()
	rc.Bucket = c.Bucket
	rc.Path = c.BackupName

	//client := lss3.NewReplicaClient()
	//client.Bucket = s.c.Bucket
	//client.Endpoint = s.c.Endpoint
	//client.SkipVerify = true
	//client.ForcePathStyle = true
	//client.AccessKeyID = s.c.AwsAccessKeyID
	//client.SecretAccessKey = s.c.AwsSecretAccessKey

	replica := litestream.NewReplica(lsdb, "gcs")
	replica.Client = rc
	return replica
}

func restore(ctx context.Context, replica *litestream.Replica) (err error) {
	// Skip restore if local database already exists.
	if _, err := os.Stat(replica.DB().Path()); err == nil {
		slog.Warn("local database already exists, skipping restore")
		return nil
	} else if !os.IsNotExist(err) {
		return err
	}

	// Configure restore to write out to DSN path.
	opt := litestream.NewRestoreOptions()
	opt.OutputPath = replica.DB().Path()

	// Determine the latest generation to restore from.
	if opt.Generation, _, err = replica.CalcRestoreTarget(ctx, opt); err != nil {
		return err
	}

	// Only restore if there is a generation available on the replica.
	// Otherwise we'll let the application create a new database.
	if opt.Generation == "" {
		slog.Warn("no generation found, creating new database")
		return nil
	}

	slog.Info("restoring replica for generation", "generation", opt.Generation)
	if err := replica.Restore(ctx, opt); err != nil {
		return err
	}
	slog.Info("restore complete")
	return nil
}
