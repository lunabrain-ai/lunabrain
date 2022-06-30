CREATE TABLE "public"."bookmark_pile" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, PRIMARY KEY ("id") );COMMENT ON TABLE "public"."bookmark_pile" IS E'An unorganized pile of bookmarks that have been collected.';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
