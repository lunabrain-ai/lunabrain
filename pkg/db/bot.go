package db

import (
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/pkg/errors"
)

func (s *Store) UpsertBot(name string) (uuid.UUID, error) {
	bot := &model.Bot{
		Name: name,
	}
	res := s.db.Where(bot).FirstOrCreate(bot)
	if res.Error != nil {
		return uuid.UUID{}, errors.Wrapf(res.Error, "could not create bot")
	}
	return bot.ID, nil
}
