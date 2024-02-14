package group

import (
	"context"
	"github.com/google/uuid"
	"github.com/justshare-io/justshare/pkg/ent"
	"github.com/justshare-io/justshare/pkg/ent/group"
	"github.com/justshare-io/justshare/pkg/ent/groupinvite"
	"github.com/justshare-io/justshare/pkg/gen/user"
	"github.com/pkg/errors"
)

type EntStore struct {
	client *ent.Client
}

func NewEntStore(client *ent.Client) *EntStore {
	return &EntStore{
		client: client,
	}
}

func (s *EntStore) ValidGroupInvite(ctx context.Context, secret string) (uuid.UUID, error) {
	inv, err := s.client.GroupInvite.Query().
		Where(groupinvite.Secret(secret)).
		Only(ctx)

	if err != nil {
		if ent.IsNotFound(err) {
			return uuid.UUID{}, errors.Wrapf(err, "group invite not found")
		}
		return uuid.UUID{}, errors.Wrapf(err, "could not get group invite")
	}

	return inv.QueryGroup().OnlyX(ctx).ID, nil
}

func (s *EntStore) GetGroupByID(ctx context.Context, groupID uuid.UUID) (*user.Group, error) {
	grp, err := s.client.Group.Query().
		Where(group.ID(groupID)).
		Only(ctx)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, errors.Wrapf(err, "group not found")
		}
		return nil, errors.Wrapf(err, "could not get group")
	}
	return grp.Data, nil
}

func (s *EntStore) CreateGroupInvite(ctx context.Context, groupID uuid.UUID) (string, error) {
	secret := uuid.New().String()

	_, err := s.client.GroupInvite.Create().
		SetSecret(secret).
		SetGroupID(groupID).
		Save(ctx)
	if err != nil {
		return "", errors.Wrapf(err, "could not create group invite")
	}
	return secret, nil
}

func (s *EntStore) CreateGroup(ctx context.Context, creator uuid.UUID, data *user.Group) (uuid.UUID, error) {
	grp, err := s.client.Group.Create().
		SetData(data).
		Save(ctx)
	if err != nil {
		return uuid.UUID{}, errors.Wrapf(err, "could not create group")
	}

	_, err = s.client.GroupUser.Create().
		SetUserID(creator).
		SetGroupID(grp.ID).
		SetRole("admin").
		Save(ctx)
	if err != nil {
		return uuid.UUID{}, errors.Wrapf(err, "could not create group user")
	}
	return grp.ID, nil
}

func (s *EntStore) DeleteGroup(ctx context.Context, groupID uuid.UUID) error {
	err := s.client.Group.DeleteOneID(groupID).
		Exec(ctx)

	if err != nil {
		return errors.Wrapf(err, "could not delete group")
	}
	return nil
}

func (s *EntStore) GetTagsForGroup(ctx context.Context, groupID uuid.UUID) ([]string, error) {
	grp, err := s.client.Group.Query().
		Where(group.ID(groupID)).
		WithContent(func(q *ent.ContentQuery) {
			q.WithTags()
		}).
		Only(ctx)
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

func (s *EntStore) ShareContent(ctx context.Context, contentID, groupID uuid.UUID) error {
	_, err := s.client.Content.UpdateOneID(contentID).
		AddGroupIDs(groupID).
		Save(ctx)
	return err
}
