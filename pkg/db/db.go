package db

import (
	"context"
	"github.com/benbjohnson/litestream"
	lsgcs "github.com/benbjohnson/litestream/gcs"
	"github.com/google/wire"
	"github.com/justshare-io/justshare/pkg/db/model"
	"github.com/pkg/errors"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log/slog"
	"os"
	"path"
	"strings"
)

var (
	ProviderSet = wire.NewSet(
		NewConfig,
		NewGorm,
		NewGormStore,
		NewEnt,
	)
)

type GormStore struct {
	c  Config
	db *gorm.DB
}

func NewGorm(c Config) (*gorm.DB, error) {
	var openedDb gorm.Dialector
	if strings.Contains(c.DSN, "postgres") {
		openedDb = postgres.Open(c.DSN)
	} else {
		dir, _ := path.Split(c.DSN)
		if dir != "" {
			if err := os.MkdirAll(dir, 0755); err != nil {
				return nil, err
			}
		}
		openedDb = sqlite.Open(c.DSN)
	}

	db, err := gorm.Open(openedDb, &gorm.Config{
		//Logger: Logger{
		//	Debug: c.Debug,
		//},
	})
	if err != nil {
		return nil, err
	}
	return db, nil
}

// TODO breadchris set this up for ent
func NewGormStore(c Config) (*GormStore, error) {
	s := &GormStore{
		c: c,
	}

	var lsdb *litestream.DB
	if s.c.BackupsEnabled {
		lsdb = litestream.NewDB(s.c.DSN)

		if err := lsdb.Open(); err != nil {
			return nil, err
		}
		replica := s.newReplica(lsdb)
		lsdb.Replicas = append(lsdb.Replicas, replica)
		if err := s.Restore(context.Background(), replica); err != nil {
			return nil, err
		}
	}

	// TODO breadchris gorm must be created after a replication attempt so that an empty database isn't create
	// TODO breadchris database instantiation should be generic
	var err error
	if s.db, err = NewGorm(c); err != nil {
		return nil, err
	}

	if s.c.BackupsEnabled {
		if lsdb == nil {
			return nil, errors.New("lsdb is nil")
		}
		if err = s.registerDBCallbacks(context.Background(), lsdb); err != nil {
			return nil, err
		}
	}

	if err = s.Migrate(); err != nil {
		return nil, err
	}
	slog.Debug("database migrated")
	return s, nil
}

func (s *GormStore) DB() *gorm.DB {
	return s.db
}

func (s *GormStore) registerDBCallbacks(ctx context.Context, lsdb *litestream.DB) error {
	f := func(tx *gorm.DB) {
		slog.Debug("replicating DB")
		if err := lsdb.Sync(ctx); err != nil {
			slog.Error("failed to sync WAL")
			return
		}
		if err := lsdb.Replicas[0].Sync(ctx); err != nil {
			slog.Error("failed to backup DB")
			return
		}
	}

	if err := s.db.Callback().Update().Register("update_replicate", f); err != nil {
		return err
	}
	if err := s.db.Callback().Create().Register("create_replicate", f); err != nil {
		return err
	}
	return nil
}

func (s *GormStore) newReplica(lsdb *litestream.DB) *litestream.Replica {
	// TODO breadchris support gcs https://litestream.io/guides/gcs/
	c := lsgcs.NewReplicaClient()
	c.Bucket = s.c.Bucket
	c.Path = s.c.BackupName

	//client := lss3.NewReplicaClient()
	//client.Bucket = s.c.Bucket
	//client.Endpoint = s.c.Endpoint
	//client.SkipVerify = true
	//client.ForcePathStyle = true
	//client.AccessKeyID = s.c.AwsAccessKeyID
	//client.SecretAccessKey = s.c.AwsSecretAccessKey

	replica := litestream.NewReplica(lsdb, "gcs")
	replica.Client = c
	return replica
}

func (s *GormStore) Restore(ctx context.Context, replica *litestream.Replica) (err error) {
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

func (s *GormStore) Migrate() error {
	// TODO breadchris migration should be done via a migration tool, no automigrate
	slog.Info("migrating database")
	err := s.db.AutoMigrate(
		&model.Content{},
		&model.DiscordChannel{},
		&model.DiscordMessage{},
		&model.DiscordTranscript{},
		&model.HNStory{},
		&model.GroupUser{},
		&model.GroupInvite{},
		&model.User{},
		&model.Group{},
		&model.Vote{},
		&model.Tag{},
		&model.GroupBot{},
		&model.Bot{},
	)
	if err != nil {
		return err
	}
	return nil
}
