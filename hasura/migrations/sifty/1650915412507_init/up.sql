CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

CREATE TABLE IF NOT EXISTS public.bookmarks(
	id       uuid       DEFAULT public.gen_random_uuid() NOT NULL,
	url      TEXT       NOT NULL,
	title    TEXT       NOT NULL,
	excerpt  TEXT       NOT NULL DEFAULT '',
	author   TEXT       NOT NULL DEFAULT '',
	public   BOOLEAN    NOT NULL DEFAULT FALSE,
	content  TEXT       NOT NULL DEFAULT '',
	html     TEXT       NOT NULL DEFAULT '',
	modified TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(id),
	CONSTRAINT bookmark_url_UNIQUE UNIQUE (url)
);

CREATE TABLE IF NOT EXISTS public.tags(
	id   uuid       DEFAULT public.gen_random_uuid() NOT NULL,
	name VARCHAR(250) NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT tag_name_UNIQUE UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS public.bookmark_tags(
	bookmark_id uuid      NOT NULL,
	tag_id      uuid      NOT NULL,
	PRIMARY KEY(bookmark_id, tag_id),
	CONSTRAINT bookmark_tag_bookmark_id_FK FOREIGN KEY (bookmark_id) REFERENCES public.bookmarks(id),
	CONSTRAINT bookmark_tag_tag_id_FK FOREIGN KEY (tag_id) REFERENCES public.tags (id)
);

CREATE INDEX IF NOT EXISTS bookmark_tag_bookmark_id_FK ON public.bookmark_tags(bookmark_id);
CREATE INDEX IF NOT EXISTS bookmark_tag_tag_id_FK ON public.bookmark_tags(tag_id);

CREATE TABLE public.users (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    kratos_id uuid NOT NULL, PRIMARY KEY (id),
    FOREIGN KEY (kratos_id) REFERENCES public.identities(id) ON UPDATE cascade ON DELETE cascade
);

COMMENT ON TABLE public.users IS E'Users for Sifty';

CREATE TABLE public.user_bookmarks (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    bookmark_id uuid NOT NULL,
    name text,
    PRIMARY KEY (id),
    FOREIGN KEY (bookmark_id) REFERENCES public.bookmarks(id) ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE cascade ON DELETE cascade
);

COMMENT ON TABLE public.user_bookmarks IS E'Bookmarks for a user';
