CREATE TABLE "public"."pile_user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "pile_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade);COMMENT ON TABLE "public"."pile_user" IS E'User association to a pile.';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
