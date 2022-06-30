comment on column "public"."pile_consumer"."contributor" is E'A consumer for bookmarks that are added to a pile.';
alter table "public"."pile_consumer" alter column "contributor" drop not null;
alter table "public"."pile_consumer" add column "contributor" uuid;
