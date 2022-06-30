alter table "public"."pile_consumer"
  add constraint "pile_consumer_contributor_fkey"
  foreign key ("contributor")
  references "public"."user"
  ("id") on update cascade on delete cascade;
