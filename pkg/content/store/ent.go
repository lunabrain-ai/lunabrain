package store

import (
	"context"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/ent"
	entcontent "github.com/lunabrain-ai/lunabrain/pkg/ent/content"
	"github.com/lunabrain-ai/lunabrain/pkg/ent/group"
	"github.com/lunabrain-ai/lunabrain/pkg/ent/schema"
	"github.com/lunabrain-ai/lunabrain/pkg/ent/tag"
	entuser "github.com/lunabrain-ai/lunabrain/pkg/ent/user"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content"
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

func (s *EntStore) DeleteContent(ctx context.Context, id uuid.UUID) error {
	err := s.client.Content.DeleteOneID(id).Exec(ctx)
	return err
}

func (s *EntStore) SaveOrUpdateContent(ctx context.Context, userID, botID uuid.UUID, data *content.Content, root bool) (*ent.Content, error) {
	var (
		c   *ent.Content
		err error
		id  = uuid.New()
	)

	contentEncoder := schema.ContentEncoder{Content: data}

	if data.Id != "" {
		id = uuid.MustParse(data.Id)
		// Try to find the content by ID
		c, err = s.client.Content.Get(ctx, id)
		if err != nil && !ent.IsNotFound(err) {
			return nil, err
		}
	}

	if c == nil {
		// Content not found, create new
		c, err = s.client.Content.Create().
			SetID(id).
			SetRoot(root).
			SetData(&contentEncoder).
			SetUserID(userID).
			Save(ctx)
	} else {
		// TODO breadchris authorization
		// Update existing content
		c, err = c.Update().
			SetData(&contentEncoder).
			Save(ctx)
	}

	if err != nil {
		return nil, err
	}

	return c, nil
}

func (s *EntStore) UpsertTags(ctx context.Context, tags []string) error {
	for _, t := range tags {
		existingTag, err := s.client.Tag.Query().Where(tag.Name(t)).Only(ctx)
		if err != nil && !ent.IsNotFound(err) {
			return errors.Wrapf(err, "error querying tag %s", t)
		}
		if existingTag == nil {
			// Tag not found, create new
			_, err = s.client.Tag.Create().SetName(t).Save(ctx)
			if err != nil {
				return errors.Wrapf(err, "error creating tag %s", t)
			}
		}
	}
	return nil
}

func (s *EntStore) SaveContent(ctx context.Context, userID, botID uuid.UUID, data *content.Content, related []*content.Content) (uuid.UUID, error) {
	c, err := s.SaveOrUpdateContent(ctx, userID, botID, data, true)
	if err != nil {
		return uuid.Nil, errors.Wrapf(err, "unable to save content")
	}

	// Handle related content
	var children []*ent.Content
	for _, rel := range related {
		child, err := s.SaveOrUpdateContent(ctx, userID, botID, rel, false)
		if err != nil {
			return uuid.Nil, errors.Wrapf(err, "unable to save related content")
		}
		children = append(children, child)
	}
	if err = c.Update().AddChildren(children...).Exec(ctx); err != nil {
		return uuid.Nil, errors.Wrapf(err, "unable to link related content")
	}
	return c.ID, nil
}

func (s *EntStore) SearchContent(ctx context.Context, userID uuid.UUID, page, limit int, groupID uuid.UUID, tags []string) ([]*ent.Content, error) {
	query := s.client.Content.Query().
		Where(entcontent.Root(true))

	if groupID != uuid.Nil {
		query = query.Where(entcontent.HasGroupsWith(group.ID(groupID)))
	} else {
		query = query.Where(entcontent.HasUserWith(entuser.ID(userID)))
	}

	for _, t := range tags {
		query = query.Where(entcontent.HasTagsWith(tag.Name(t)))
	}

	// query = query.Offset((page - 1) * limit).Limit(limit)

	contents, err := query.WithTags().
		WithChildren().
		Order(ent.Desc(entcontent.FieldCreatedAt)).
		All(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "could not get content")
	}

	return contents, nil
}

func (s *EntStore) GetContentByID(ctx context.Context, contentID uuid.UUID) (*ent.Content, error) {
	return s.client.Content.Get(ctx, contentID)
}

func (s *EntStore) SetTags(ctx context.Context, contentID uuid.UUID, tags []string) error {
	c, err := s.client.Content.Get(ctx, contentID)
	if err != nil {
		return errors.Wrapf(err, "could not find content")
	}

	var tagIDs []uuid.UUID
	for _, t := range tags {
		ctTag, err := s.client.Tag.Query().Where(tag.Name(t)).Only(ctx)
		if err != nil && !ent.IsNotFound(err) {
			return errors.Wrapf(err, "error querying tag %s", t)
		}

		if ctTag == nil {
			tg, err := s.client.Tag.Create().SetName(t).Save(ctx)
			if err != nil {
				return errors.Wrapf(err, "could not create/find tag")
			}
			ctTag = tg
		}
		tagIDs = append(tagIDs, ctTag.ID)
	}

	_, err = c.Update().ClearTags().AddTagIDs(tagIDs...).Save(ctx)
	if err != nil {
		return errors.Wrapf(err, "could not set tags")
	}

	return nil
}

func (s *EntStore) GetTags(ctx context.Context) ([]string, error) {
	tags, err := s.client.Tag.Query().All(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "could not get tags")
	}
	var tagNames []string
	for _, t := range tags {
		tagNames = append(tagNames, t.Name)
	}
	return tagNames, nil
}

func (s *EntStore) GetTagsForGroup(ctx context.Context, groupID uuid.UUID) ([]string, error) {
	g, err := s.client.Group.Get(ctx, groupID)
	if err != nil {
		return nil, errors.Wrapf(err, "could not get group")
	}

	tags, err := g.QueryTags().All(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "could not get tags for group")
	}

	var tagNames []string
	for _, t := range tags {
		tagNames = append(tagNames, t.Name)
	}
	return tagNames, nil
}
