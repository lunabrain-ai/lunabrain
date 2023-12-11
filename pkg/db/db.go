package db

import (
	"context"
	"github.com/alexferrari88/gohn/pkg/gohn"
	"github.com/benbjohnson/litestream"
	lsgcs "github.com/benbjohnson/litestream/gcs"
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/pkg/errors"
	"gorm.io/datatypes"
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
		New,
		NewSession,
	)
)

type Store struct {
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
		Logger: Logger{
			Debug: c.Debug,
		},
	})
	if err != nil {
		return nil, err
	}
	return db, nil
}

func New(c Config) (*Store, error) {
	s := &Store{
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

func (s *Store) registerDBCallbacks(ctx context.Context, lsdb *litestream.DB) error {
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

func (s *Store) newReplica(lsdb *litestream.DB) *litestream.Replica {
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

func (s *Store) Restore(ctx context.Context, replica *litestream.Replica) (err error) {
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

func (s *Store) Migrate() error {
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

func (s *Store) SaveHNStory(ID int, url string, position *int, contentID uuid.UUID, story *gohn.Item, comments gohn.ItemsIndex) (*model.HNStory, bool, error) {
	hnStory := &model.HNStory{
		ID:        ID,
		URL:       url,
		ContentID: contentID,
		Data: datatypes.JSONType[*gohn.Item]{
			Data: story,
		},
		Comments: datatypes.JSONType[gohn.ItemsIndex]{
			Data: comments,
		},
	}

	if position != nil {
		hnStory.Position = *position
	}

	var existingStory model.HNStory
	res := s.db.First(&existingStory, ID)
	if res.Error != nil {
		if !errors.Is(res.Error, gorm.ErrRecordNotFound) {
			return nil, false, errors.Wrapf(res.Error, "could not get hn story")
		}
		res = s.db.Create(hnStory)
		if res.Error != nil {
			return nil, false, errors.Wrapf(res.Error, "could not create hn story")
		}
		return hnStory, true, nil
	}

	if position != nil {
		res = s.db.Model(&model.HNStory{}).Where("position = ?", position).Update("position", nil)
		if res.Error != nil && !errors.Is(res.Error, gorm.ErrRecordNotFound) {
			return nil, false, errors.Wrapf(res.Error, "could not update hn story position")
		}
	}

	res = s.db.Model(&existingStory).Where(ID).Updates(hnStory)
	if res.Error != nil {
		return nil, false, errors.Wrapf(res.Error, "could not update hn story")
	}
	return hnStory, false, nil
}

func (s *Store) GetHNStory(ID int) (*model.HNStory, error) {
	var hnStory model.HNStory
	res := s.db.Where("id = ?", ID).First(&hnStory)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get hn story")
	}
	return &hnStory, nil
}

func (s *Store) GetTopHNStories() ([]model.HNStory, error) {
	var hnStories []model.HNStory
	res := s.db.Where("position IS NOT NULL").Order("position asc").Limit(30).Preload("Content").Preload("Content.NormalizedContent").Preload("Content.NormalizedContent.TransformedContent").Find(&hnStories)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get hn stories")
	}
	return hnStories, nil
}

func (s *Store) AddContentToIndex(contentID uuid.UUID, indexID uuid.UUID) error {
	res := s.db.Model(&model.Content{}).Where("id = ?", contentID).Update("index_id", indexID)
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not add content to index")
	}
	return nil
}

func (s *Store) GetDiscordMessages(chanID string) ([]*model.DiscordMessage, error) {
	var discordMessages []*model.DiscordMessage
	res := s.db.Where("discord_channel_id = ?", chanID).Order("created_at DESC").Find(&discordMessages)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get discord messages")
	}
	return discordMessages, nil
}

func (s *Store) GetLatestDiscordMessage() (*model.DiscordMessage, error) {
	var discordMessage model.DiscordMessage
	res := s.db.Model(&discordMessage).Order("created_at DESC").First(&discordMessage)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get latest discord message")
	}
	return &discordMessage, nil
}

func (s *Store) GetLatestDiscordTranscript() (*model.DiscordTranscript, error) {
	var discordTranscript model.DiscordTranscript
	res := s.db.Model(&discordTranscript).Order("created_at DESC").First(&discordTranscript)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get latest discord transcript")
	}
	return &discordTranscript, nil
}

func (s *Store) StoreDiscordTranscript(chanID, startMsg, endMsg, transcript string) error {
	res := s.db.Create(&model.DiscordTranscript{
		DiscordChannelID: chanID,
		Transcript:       transcript,
		StartMessageID:   startMsg,
		EndMessageID:     endMsg,
	})
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not save discord transcript")
	}
	return nil
}

func (s *Store) StoreDiscordMessages(msgs []*model.DiscordMessage) error {
	for _, msg := range msgs {
		res := s.db.Create(msg)
		if res.Error != nil {
			//return errors.Wrapf(res.Error, "could not save discord message: %v", msg.ID)
			slog.Warn("could not save discord message", "error", res.Error, "msg_id", msg.MessageID)
			continue
		}
	}
	return nil
}
