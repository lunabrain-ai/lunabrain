alter table "public"."pile_user"
  add constraint "pile_user_pile_id_fkey"
  foreign key ("pile_id")
  references "public"."pile"
  ("id") on update cascade on delete cascade;
