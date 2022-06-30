alter table "public"."pile_bookmark"
  add constraint "pile_bookmark_user_id_fkey"
  foreign key ("user_id")
  references "public"."user"
  ("id") on update cascade on delete cascade;
