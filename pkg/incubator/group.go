package incubator

import (
	"context"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen/user"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/group"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/groupinvite"
	"github.com/pkg/errors"
	"log"
)

type Store struct {
	client *ent.Client
}

func New() *Store {
	client, err := ent.Open("sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
	if err != nil {
		log.Fatalf("failed opening connection to sqlite: %v", err)
	}
	return &Store{
		client: client,
	}
}

func (s *Store) ValidGroupInvite(secret string) (uuid.UUID, error) {
	inv, err := s.client.GroupInvite.Query().
		Where(groupinvite.Secret(secret)).
		Only(context.Background())

	if err != nil {
		if ent.IsNotFound(err) {
			return uuid.UUID{}, errors.Wrapf(err, "group invite not found")
		}
		return uuid.UUID{}, errors.Wrapf(err, "could not get group invite")
	}

	return inv.QueryGroup().OnlyX(context.Background()).ID, nil
}

//func (s *Store) GetGroupByID(groupID uuid.UUID) (*user.Group, error) {
//	grp, err := s.client.Group.Query().
//		Where(group.ID(groupID)).
//		Only(context.Background())
//
//	if err != nil {
//		if ent.IsNotFound(err) {
//			return nil, errors.Wrapf(err, "group not found")
//		}
//		return nil, errors.Wrapf(err, "could not get group")
//	}
//
//	return grp.Data, nil
//}

func (s *Store) CreateGroupInvite(groupID uuid.UUID) (string, error) {
	secret := uuid.New().String()

	_, err := s.client.GroupInvite.Create().
		SetSecret(secret).
		SetGroupID(groupID).
		Save(context.Background())

	if err != nil {
		return "", errors.Wrapf(err, "could not create group invite")
	}

	return secret, nil
}

func (s *Store) CreateGroup(creator uuid.UUID, data *user.Group) (uuid.UUID, error) {
	grp, err := s.client.Group.Create().
		//SetData(data).
		Save(context.Background())

	if err != nil {
		return uuid.UUID{}, errors.Wrapf(err, "could not create group")
	}

	_, err = s.client.GroupUser.Create().
		SetUserID(creator).
		SetGroupID(grp.ID).
		SetRole("admin").
		Save(context.Background())

	if err != nil {
		return uuid.UUID{}, errors.Wrapf(err, "could not create group user")
	}

	return grp.ID, nil
}

func (s *Store) DeleteGroup(groupID uuid.UUID) error {
	err := s.client.Group.DeleteOneID(groupID).
		Exec(context.Background())

	if err != nil {
		return errors.Wrapf(err, "could not delete group")
	}
	return nil
}

//func (s *Store) GetGroupsForUser(userID uuid.UUID) ([]*user.Group, error) {
//	usr, err := s.client.User.Query().
//		Where(user.ID(userID)).
//		WithGroups().
//		Only(context.Background())
//
//	if err != nil {
//		if ent.IsNotFound(err) {
//			return nil, errors.Wrapf(err, "user not found")
//		}
//		return nil, errors.Wrapf(err, "could not get groups for user")
//	}
//
//	return usr.Edges.Groups, nil
//}

func (s *Store) JoinGroup(userID, groupID uuid.UUID) error {
	_, err := s.client.GroupUser.Create().
		SetUserID(userID).
		SetGroupID(groupID).
		Save(context.Background())

	if err != nil {
		return errors.Wrapf(err, "could not join group")
	}
	return nil
}

func (s *Store) GetTagsForGroup(groupID uuid.UUID) ([]string, error) {
	grp, err := s.client.Group.Query().
		Where(group.ID(groupID)).
		WithContent(func(q *ent.ContentQuery) {
			q.WithTags()
		}).
		Only(context.Background())

	if err != nil {
		if ent.IsNotFound(err) {
			return nil, errors.Wrapf(err, "group not found")
		}
		return nil, errors.Wrapf(err, "could not get tags")
	}

	var tagNames []string
	for _, c := range grp.Edges.Content {
		for _, tag := range c.Edges.Tags {
			tagNames = append(tagNames, tag.Name)
		}
	}

	return tagNames, nil
}
