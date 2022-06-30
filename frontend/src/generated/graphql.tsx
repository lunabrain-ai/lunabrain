import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  jsonb: any;
  pile_consumer_type: any;
  timestamp: any;
  timestamptz: any;
  uuid: any;
};

export type BookmarkQueryRequest = {
  test: Scalars['String'];
};

export type BookmarkQueryResponse = {
  __typename?: 'BookmarkQueryResponse';
  test: Scalars['String'];
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']>;
  _gt?: InputMaybe<Scalars['Boolean']>;
  _gte?: InputMaybe<Scalars['Boolean']>;
  _in?: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Boolean']>;
  _lte?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type NewBookmark = {
  url: Scalars['String'];
};

export type SavedBookmark = {
  __typename?: 'SavedBookmark';
  id: Scalars['ID'];
  title: Scalars['String'];
  url: Scalars['String'];
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "bookmark" */
export type Bookmark = {
  __typename?: 'bookmark';
  author: Scalars['String'];
  /** An array relationship */
  bookmark_tags: Array<Bookmark_Tag>;
  /** An aggregate relationship */
  bookmark_tags_aggregate: Bookmark_Tag_Aggregate;
  content: Scalars['String'];
  excerpt: Scalars['String'];
  html: Scalars['String'];
  id: Scalars['uuid'];
  modified: Scalars['timestamp'];
  public: Scalars['Boolean'];
  title: Scalars['String'];
  url: Scalars['String'];
  /** An array relationship */
  user_bookmarks: Array<User_Bookmark>;
  /** An aggregate relationship */
  user_bookmarks_aggregate: User_Bookmark_Aggregate;
};


/** columns and relationships of "bookmark" */
export type BookmarkBookmark_TagsArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Tag_Order_By>>;
  where?: InputMaybe<Bookmark_Tag_Bool_Exp>;
};


/** columns and relationships of "bookmark" */
export type BookmarkBookmark_Tags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Tag_Order_By>>;
  where?: InputMaybe<Bookmark_Tag_Bool_Exp>;
};


/** columns and relationships of "bookmark" */
export type BookmarkUser_BookmarksArgs = {
  distinct_on?: InputMaybe<Array<User_Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Bookmark_Order_By>>;
  where?: InputMaybe<User_Bookmark_Bool_Exp>;
};


/** columns and relationships of "bookmark" */
export type BookmarkUser_Bookmarks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Bookmark_Order_By>>;
  where?: InputMaybe<User_Bookmark_Bool_Exp>;
};

/** aggregated selection of "bookmark" */
export type Bookmark_Aggregate = {
  __typename?: 'bookmark_aggregate';
  aggregate?: Maybe<Bookmark_Aggregate_Fields>;
  nodes: Array<Bookmark>;
};

/** aggregate fields of "bookmark" */
export type Bookmark_Aggregate_Fields = {
  __typename?: 'bookmark_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Bookmark_Max_Fields>;
  min?: Maybe<Bookmark_Min_Fields>;
};


/** aggregate fields of "bookmark" */
export type Bookmark_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bookmark_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "bookmark". All fields are combined with a logical 'AND'. */
export type Bookmark_Bool_Exp = {
  _and?: InputMaybe<Array<Bookmark_Bool_Exp>>;
  _not?: InputMaybe<Bookmark_Bool_Exp>;
  _or?: InputMaybe<Array<Bookmark_Bool_Exp>>;
  author?: InputMaybe<String_Comparison_Exp>;
  bookmark_tags?: InputMaybe<Bookmark_Tag_Bool_Exp>;
  content?: InputMaybe<String_Comparison_Exp>;
  excerpt?: InputMaybe<String_Comparison_Exp>;
  html?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  modified?: InputMaybe<Timestamp_Comparison_Exp>;
  public?: InputMaybe<Boolean_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
  user_bookmarks?: InputMaybe<User_Bookmark_Bool_Exp>;
};

/** unique or primary key constraints on table "bookmark" */
export enum Bookmark_Constraint {
  /** unique or primary key constraint */
  BookmarkPkey = 'bookmark_pkey',
  /** unique or primary key constraint */
  BookmarkUrlUnique = 'bookmark_url_unique'
}

/** input type for inserting data into table "bookmark" */
export type Bookmark_Insert_Input = {
  author?: InputMaybe<Scalars['String']>;
  bookmark_tags?: InputMaybe<Bookmark_Tag_Arr_Rel_Insert_Input>;
  content?: InputMaybe<Scalars['String']>;
  excerpt?: InputMaybe<Scalars['String']>;
  html?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  modified?: InputMaybe<Scalars['timestamp']>;
  public?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  user_bookmarks?: InputMaybe<User_Bookmark_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Bookmark_Max_Fields = {
  __typename?: 'bookmark_max_fields';
  author?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  html?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  modified?: Maybe<Scalars['timestamp']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Bookmark_Min_Fields = {
  __typename?: 'bookmark_min_fields';
  author?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  html?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  modified?: Maybe<Scalars['timestamp']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "bookmark" */
export type Bookmark_Mutation_Response = {
  __typename?: 'bookmark_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Bookmark>;
};

/** input type for inserting object relation for remote table "bookmark" */
export type Bookmark_Obj_Rel_Insert_Input = {
  data: Bookmark_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Bookmark_On_Conflict>;
};

/** on_conflict condition type for table "bookmark" */
export type Bookmark_On_Conflict = {
  constraint: Bookmark_Constraint;
  update_columns?: Array<Bookmark_Update_Column>;
  where?: InputMaybe<Bookmark_Bool_Exp>;
};

/** Ordering options when selecting data from "bookmark". */
export type Bookmark_Order_By = {
  author?: InputMaybe<Order_By>;
  bookmark_tags_aggregate?: InputMaybe<Bookmark_Tag_Aggregate_Order_By>;
  content?: InputMaybe<Order_By>;
  excerpt?: InputMaybe<Order_By>;
  html?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  modified?: InputMaybe<Order_By>;
  public?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  user_bookmarks_aggregate?: InputMaybe<User_Bookmark_Aggregate_Order_By>;
};

/** primary key columns input for table: bookmark */
export type Bookmark_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "bookmark" */
export enum Bookmark_Select_Column {
  /** column name */
  Author = 'author',
  /** column name */
  Content = 'content',
  /** column name */
  Excerpt = 'excerpt',
  /** column name */
  Html = 'html',
  /** column name */
  Id = 'id',
  /** column name */
  Modified = 'modified',
  /** column name */
  Public = 'public',
  /** column name */
  Title = 'title',
  /** column name */
  Url = 'url'
}

/** input type for updating data in table "bookmark" */
export type Bookmark_Set_Input = {
  author?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  excerpt?: InputMaybe<Scalars['String']>;
  html?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  modified?: InputMaybe<Scalars['timestamp']>;
  public?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "bookmark_tag" */
export type Bookmark_Tag = {
  __typename?: 'bookmark_tag';
  bookmark_id: Scalars['uuid'];
  tag_id: Scalars['uuid'];
};

/** aggregated selection of "bookmark_tag" */
export type Bookmark_Tag_Aggregate = {
  __typename?: 'bookmark_tag_aggregate';
  aggregate?: Maybe<Bookmark_Tag_Aggregate_Fields>;
  nodes: Array<Bookmark_Tag>;
};

/** aggregate fields of "bookmark_tag" */
export type Bookmark_Tag_Aggregate_Fields = {
  __typename?: 'bookmark_tag_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Bookmark_Tag_Max_Fields>;
  min?: Maybe<Bookmark_Tag_Min_Fields>;
};


/** aggregate fields of "bookmark_tag" */
export type Bookmark_Tag_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bookmark_Tag_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "bookmark_tag" */
export type Bookmark_Tag_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Bookmark_Tag_Max_Order_By>;
  min?: InputMaybe<Bookmark_Tag_Min_Order_By>;
};

/** input type for inserting array relation for remote table "bookmark_tag" */
export type Bookmark_Tag_Arr_Rel_Insert_Input = {
  data: Array<Bookmark_Tag_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Bookmark_Tag_On_Conflict>;
};

/** Boolean expression to filter rows from the table "bookmark_tag". All fields are combined with a logical 'AND'. */
export type Bookmark_Tag_Bool_Exp = {
  _and?: InputMaybe<Array<Bookmark_Tag_Bool_Exp>>;
  _not?: InputMaybe<Bookmark_Tag_Bool_Exp>;
  _or?: InputMaybe<Array<Bookmark_Tag_Bool_Exp>>;
  bookmark_id?: InputMaybe<Uuid_Comparison_Exp>;
  tag_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "bookmark_tag" */
export enum Bookmark_Tag_Constraint {
  /** unique or primary key constraint */
  BookmarkTagPkey = 'bookmark_tag_pkey'
}

/** input type for inserting data into table "bookmark_tag" */
export type Bookmark_Tag_Insert_Input = {
  bookmark_id?: InputMaybe<Scalars['uuid']>;
  tag_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Bookmark_Tag_Max_Fields = {
  __typename?: 'bookmark_tag_max_fields';
  bookmark_id?: Maybe<Scalars['uuid']>;
  tag_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "bookmark_tag" */
export type Bookmark_Tag_Max_Order_By = {
  bookmark_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Bookmark_Tag_Min_Fields = {
  __typename?: 'bookmark_tag_min_fields';
  bookmark_id?: Maybe<Scalars['uuid']>;
  tag_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "bookmark_tag" */
export type Bookmark_Tag_Min_Order_By = {
  bookmark_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "bookmark_tag" */
export type Bookmark_Tag_Mutation_Response = {
  __typename?: 'bookmark_tag_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Bookmark_Tag>;
};

/** on_conflict condition type for table "bookmark_tag" */
export type Bookmark_Tag_On_Conflict = {
  constraint: Bookmark_Tag_Constraint;
  update_columns?: Array<Bookmark_Tag_Update_Column>;
  where?: InputMaybe<Bookmark_Tag_Bool_Exp>;
};

/** Ordering options when selecting data from "bookmark_tag". */
export type Bookmark_Tag_Order_By = {
  bookmark_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: bookmark_tag */
export type Bookmark_Tag_Pk_Columns_Input = {
  bookmark_id: Scalars['uuid'];
  tag_id: Scalars['uuid'];
};

/** select columns of table "bookmark_tag" */
export enum Bookmark_Tag_Select_Column {
  /** column name */
  BookmarkId = 'bookmark_id',
  /** column name */
  TagId = 'tag_id'
}

/** input type for updating data in table "bookmark_tag" */
export type Bookmark_Tag_Set_Input = {
  bookmark_id?: InputMaybe<Scalars['uuid']>;
  tag_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "bookmark_tag" */
export enum Bookmark_Tag_Update_Column {
  /** column name */
  BookmarkId = 'bookmark_id',
  /** column name */
  TagId = 'tag_id'
}

/** update columns of table "bookmark" */
export enum Bookmark_Update_Column {
  /** column name */
  Author = 'author',
  /** column name */
  Content = 'content',
  /** column name */
  Excerpt = 'excerpt',
  /** column name */
  Html = 'html',
  /** column name */
  Id = 'id',
  /** column name */
  Modified = 'modified',
  /** column name */
  Public = 'public',
  /** column name */
  Title = 'title',
  /** column name */
  Url = 'url'
}

/** columns and relationships of "identities" */
export type Identities = {
  __typename?: 'identities';
  created_at: Scalars['timestamp'];
  id: Scalars['uuid'];
  nid?: Maybe<Scalars['uuid']>;
  schema_id: Scalars['String'];
  state: Scalars['String'];
  state_changed_at?: Maybe<Scalars['timestamp']>;
  traits: Scalars['jsonb'];
  updated_at: Scalars['timestamp'];
};


/** columns and relationships of "identities" */
export type IdentitiesTraitsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "identities" */
export type Identities_Aggregate = {
  __typename?: 'identities_aggregate';
  aggregate?: Maybe<Identities_Aggregate_Fields>;
  nodes: Array<Identities>;
};

/** aggregate fields of "identities" */
export type Identities_Aggregate_Fields = {
  __typename?: 'identities_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Identities_Max_Fields>;
  min?: Maybe<Identities_Min_Fields>;
};


/** aggregate fields of "identities" */
export type Identities_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Identities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Identities_Append_Input = {
  traits?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "identities". All fields are combined with a logical 'AND'. */
export type Identities_Bool_Exp = {
  _and?: InputMaybe<Array<Identities_Bool_Exp>>;
  _not?: InputMaybe<Identities_Bool_Exp>;
  _or?: InputMaybe<Array<Identities_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  nid?: InputMaybe<Uuid_Comparison_Exp>;
  schema_id?: InputMaybe<String_Comparison_Exp>;
  state?: InputMaybe<String_Comparison_Exp>;
  state_changed_at?: InputMaybe<Timestamp_Comparison_Exp>;
  traits?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "identities" */
export enum Identities_Constraint {
  /** unique or primary key constraint */
  IdentitiesPkey = 'identities_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Identities_Delete_At_Path_Input = {
  traits?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Identities_Delete_Elem_Input = {
  traits?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Identities_Delete_Key_Input = {
  traits?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "identities" */
export type Identities_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  nid?: InputMaybe<Scalars['uuid']>;
  schema_id?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  state_changed_at?: InputMaybe<Scalars['timestamp']>;
  traits?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type Identities_Max_Fields = {
  __typename?: 'identities_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  nid?: Maybe<Scalars['uuid']>;
  schema_id?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  state_changed_at?: Maybe<Scalars['timestamp']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Identities_Min_Fields = {
  __typename?: 'identities_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  nid?: Maybe<Scalars['uuid']>;
  schema_id?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  state_changed_at?: Maybe<Scalars['timestamp']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "identities" */
export type Identities_Mutation_Response = {
  __typename?: 'identities_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Identities>;
};

/** input type for inserting object relation for remote table "identities" */
export type Identities_Obj_Rel_Insert_Input = {
  data: Identities_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Identities_On_Conflict>;
};

/** on_conflict condition type for table "identities" */
export type Identities_On_Conflict = {
  constraint: Identities_Constraint;
  update_columns?: Array<Identities_Update_Column>;
  where?: InputMaybe<Identities_Bool_Exp>;
};

/** Ordering options when selecting data from "identities". */
export type Identities_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  nid?: InputMaybe<Order_By>;
  schema_id?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
  state_changed_at?: InputMaybe<Order_By>;
  traits?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: identities */
export type Identities_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Identities_Prepend_Input = {
  traits?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "identities" */
export enum Identities_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Nid = 'nid',
  /** column name */
  SchemaId = 'schema_id',
  /** column name */
  State = 'state',
  /** column name */
  StateChangedAt = 'state_changed_at',
  /** column name */
  Traits = 'traits',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "identities" */
export type Identities_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  nid?: InputMaybe<Scalars['uuid']>;
  schema_id?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  state_changed_at?: InputMaybe<Scalars['timestamp']>;
  traits?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "identities" */
export enum Identities_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Nid = 'nid',
  /** column name */
  SchemaId = 'schema_id',
  /** column name */
  State = 'state',
  /** column name */
  StateChangedAt = 'state_changed_at',
  /** column name */
  Traits = 'traits',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "bookmark" */
  delete_bookmark?: Maybe<Bookmark_Mutation_Response>;
  /** delete single row from the table: "bookmark" */
  delete_bookmark_by_pk?: Maybe<Bookmark>;
  /** delete data from the table: "bookmark_tag" */
  delete_bookmark_tag?: Maybe<Bookmark_Tag_Mutation_Response>;
  /** delete single row from the table: "bookmark_tag" */
  delete_bookmark_tag_by_pk?: Maybe<Bookmark_Tag>;
  /** delete data from the table: "identities" */
  delete_identities?: Maybe<Identities_Mutation_Response>;
  /** delete single row from the table: "identities" */
  delete_identities_by_pk?: Maybe<Identities>;
  /** delete data from the table: "pile" */
  delete_pile?: Maybe<Pile_Mutation_Response>;
  /** delete data from the table: "pile_bookmark" */
  delete_pile_bookmark?: Maybe<Pile_Bookmark_Mutation_Response>;
  /** delete single row from the table: "pile_bookmark" */
  delete_pile_bookmark_by_pk?: Maybe<Pile_Bookmark>;
  /** delete single row from the table: "pile" */
  delete_pile_by_pk?: Maybe<Pile>;
  /** delete data from the table: "pile_consumer" */
  delete_pile_consumer?: Maybe<Pile_Consumer_Mutation_Response>;
  /** delete single row from the table: "pile_consumer" */
  delete_pile_consumer_by_pk?: Maybe<Pile_Consumer>;
  /** delete data from the table: "pile_user" */
  delete_pile_user?: Maybe<Pile_User_Mutation_Response>;
  /** delete single row from the table: "pile_user" */
  delete_pile_user_by_pk?: Maybe<Pile_User>;
  /** delete data from the table: "tag" */
  delete_tag?: Maybe<Tag_Mutation_Response>;
  /** delete single row from the table: "tag" */
  delete_tag_by_pk?: Maybe<Tag>;
  /** delete data from the table: "user" */
  delete_user?: Maybe<User_Mutation_Response>;
  /** delete data from the table: "user_bookmark" */
  delete_user_bookmark?: Maybe<User_Bookmark_Mutation_Response>;
  /** delete single row from the table: "user_bookmark" */
  delete_user_bookmark_by_pk?: Maybe<User_Bookmark>;
  /** delete single row from the table: "user" */
  delete_user_by_pk?: Maybe<User>;
  /** insert data into the table: "bookmark" */
  insert_bookmark?: Maybe<Bookmark_Mutation_Response>;
  /** insert a single row into the table: "bookmark" */
  insert_bookmark_one?: Maybe<Bookmark>;
  /** insert data into the table: "bookmark_tag" */
  insert_bookmark_tag?: Maybe<Bookmark_Tag_Mutation_Response>;
  /** insert a single row into the table: "bookmark_tag" */
  insert_bookmark_tag_one?: Maybe<Bookmark_Tag>;
  /** insert data into the table: "identities" */
  insert_identities?: Maybe<Identities_Mutation_Response>;
  /** insert a single row into the table: "identities" */
  insert_identities_one?: Maybe<Identities>;
  /** insert data into the table: "pile" */
  insert_pile?: Maybe<Pile_Mutation_Response>;
  /** insert data into the table: "pile_bookmark" */
  insert_pile_bookmark?: Maybe<Pile_Bookmark_Mutation_Response>;
  /** insert a single row into the table: "pile_bookmark" */
  insert_pile_bookmark_one?: Maybe<Pile_Bookmark>;
  /** insert data into the table: "pile_consumer" */
  insert_pile_consumer?: Maybe<Pile_Consumer_Mutation_Response>;
  /** insert a single row into the table: "pile_consumer" */
  insert_pile_consumer_one?: Maybe<Pile_Consumer>;
  /** insert a single row into the table: "pile" */
  insert_pile_one?: Maybe<Pile>;
  /** insert data into the table: "pile_user" */
  insert_pile_user?: Maybe<Pile_User_Mutation_Response>;
  /** insert a single row into the table: "pile_user" */
  insert_pile_user_one?: Maybe<Pile_User>;
  /** insert data into the table: "tag" */
  insert_tag?: Maybe<Tag_Mutation_Response>;
  /** insert a single row into the table: "tag" */
  insert_tag_one?: Maybe<Tag>;
  /** insert data into the table: "user" */
  insert_user?: Maybe<User_Mutation_Response>;
  /** insert data into the table: "user_bookmark" */
  insert_user_bookmark?: Maybe<User_Bookmark_Mutation_Response>;
  /** insert a single row into the table: "user_bookmark" */
  insert_user_bookmark_one?: Maybe<User_Bookmark>;
  /** insert a single row into the table: "user" */
  insert_user_one?: Maybe<User>;
  saveBookmark: SavedBookmark;
  /** update data of the table: "bookmark" */
  update_bookmark?: Maybe<Bookmark_Mutation_Response>;
  /** update single row of the table: "bookmark" */
  update_bookmark_by_pk?: Maybe<Bookmark>;
  /** update data of the table: "bookmark_tag" */
  update_bookmark_tag?: Maybe<Bookmark_Tag_Mutation_Response>;
  /** update single row of the table: "bookmark_tag" */
  update_bookmark_tag_by_pk?: Maybe<Bookmark_Tag>;
  /** update data of the table: "identities" */
  update_identities?: Maybe<Identities_Mutation_Response>;
  /** update single row of the table: "identities" */
  update_identities_by_pk?: Maybe<Identities>;
  /** update data of the table: "pile" */
  update_pile?: Maybe<Pile_Mutation_Response>;
  /** update data of the table: "pile_bookmark" */
  update_pile_bookmark?: Maybe<Pile_Bookmark_Mutation_Response>;
  /** update single row of the table: "pile_bookmark" */
  update_pile_bookmark_by_pk?: Maybe<Pile_Bookmark>;
  /** update single row of the table: "pile" */
  update_pile_by_pk?: Maybe<Pile>;
  /** update data of the table: "pile_consumer" */
  update_pile_consumer?: Maybe<Pile_Consumer_Mutation_Response>;
  /** update single row of the table: "pile_consumer" */
  update_pile_consumer_by_pk?: Maybe<Pile_Consumer>;
  /** update data of the table: "pile_user" */
  update_pile_user?: Maybe<Pile_User_Mutation_Response>;
  /** update single row of the table: "pile_user" */
  update_pile_user_by_pk?: Maybe<Pile_User>;
  /** update data of the table: "tag" */
  update_tag?: Maybe<Tag_Mutation_Response>;
  /** update single row of the table: "tag" */
  update_tag_by_pk?: Maybe<Tag>;
  /** update data of the table: "user" */
  update_user?: Maybe<User_Mutation_Response>;
  /** update data of the table: "user_bookmark" */
  update_user_bookmark?: Maybe<User_Bookmark_Mutation_Response>;
  /** update single row of the table: "user_bookmark" */
  update_user_bookmark_by_pk?: Maybe<User_Bookmark>;
  /** update single row of the table: "user" */
  update_user_by_pk?: Maybe<User>;
};


/** mutation root */
export type Mutation_RootDelete_BookmarkArgs = {
  where: Bookmark_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bookmark_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Bookmark_TagArgs = {
  where: Bookmark_Tag_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bookmark_Tag_By_PkArgs = {
  bookmark_id: Scalars['uuid'];
  tag_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_IdentitiesArgs = {
  where: Identities_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Identities_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_PileArgs = {
  where: Pile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Pile_BookmarkArgs = {
  where: Pile_Bookmark_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Pile_Bookmark_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Pile_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Pile_ConsumerArgs = {
  where: Pile_Consumer_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Pile_Consumer_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Pile_UserArgs = {
  where: Pile_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Pile_User_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_TagArgs = {
  where: Tag_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Tag_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_UserArgs = {
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_BookmarkArgs = {
  where: User_Bookmark_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Bookmark_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_User_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_BookmarkArgs = {
  objects: Array<Bookmark_Insert_Input>;
  on_conflict?: InputMaybe<Bookmark_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bookmark_OneArgs = {
  object: Bookmark_Insert_Input;
  on_conflict?: InputMaybe<Bookmark_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bookmark_TagArgs = {
  objects: Array<Bookmark_Tag_Insert_Input>;
  on_conflict?: InputMaybe<Bookmark_Tag_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bookmark_Tag_OneArgs = {
  object: Bookmark_Tag_Insert_Input;
  on_conflict?: InputMaybe<Bookmark_Tag_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_IdentitiesArgs = {
  objects: Array<Identities_Insert_Input>;
  on_conflict?: InputMaybe<Identities_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Identities_OneArgs = {
  object: Identities_Insert_Input;
  on_conflict?: InputMaybe<Identities_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_PileArgs = {
  objects: Array<Pile_Insert_Input>;
  on_conflict?: InputMaybe<Pile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pile_BookmarkArgs = {
  objects: Array<Pile_Bookmark_Insert_Input>;
  on_conflict?: InputMaybe<Pile_Bookmark_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pile_Bookmark_OneArgs = {
  object: Pile_Bookmark_Insert_Input;
  on_conflict?: InputMaybe<Pile_Bookmark_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pile_ConsumerArgs = {
  objects: Array<Pile_Consumer_Insert_Input>;
  on_conflict?: InputMaybe<Pile_Consumer_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pile_Consumer_OneArgs = {
  object: Pile_Consumer_Insert_Input;
  on_conflict?: InputMaybe<Pile_Consumer_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pile_OneArgs = {
  object: Pile_Insert_Input;
  on_conflict?: InputMaybe<Pile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pile_UserArgs = {
  objects: Array<Pile_User_Insert_Input>;
  on_conflict?: InputMaybe<Pile_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pile_User_OneArgs = {
  object: Pile_User_Insert_Input;
  on_conflict?: InputMaybe<Pile_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_TagArgs = {
  objects: Array<Tag_Insert_Input>;
  on_conflict?: InputMaybe<Tag_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Tag_OneArgs = {
  object: Tag_Insert_Input;
  on_conflict?: InputMaybe<Tag_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UserArgs = {
  objects: Array<User_Insert_Input>;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_BookmarkArgs = {
  objects: Array<User_Bookmark_Insert_Input>;
  on_conflict?: InputMaybe<User_Bookmark_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Bookmark_OneArgs = {
  object: User_Bookmark_Insert_Input;
  on_conflict?: InputMaybe<User_Bookmark_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_OneArgs = {
  object: User_Insert_Input;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootSaveBookmarkArgs = {
  input: NewBookmark;
};


/** mutation root */
export type Mutation_RootUpdate_BookmarkArgs = {
  _set?: InputMaybe<Bookmark_Set_Input>;
  where: Bookmark_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bookmark_By_PkArgs = {
  _set?: InputMaybe<Bookmark_Set_Input>;
  pk_columns: Bookmark_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Bookmark_TagArgs = {
  _set?: InputMaybe<Bookmark_Tag_Set_Input>;
  where: Bookmark_Tag_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bookmark_Tag_By_PkArgs = {
  _set?: InputMaybe<Bookmark_Tag_Set_Input>;
  pk_columns: Bookmark_Tag_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_IdentitiesArgs = {
  _append?: InputMaybe<Identities_Append_Input>;
  _delete_at_path?: InputMaybe<Identities_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Identities_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Identities_Delete_Key_Input>;
  _prepend?: InputMaybe<Identities_Prepend_Input>;
  _set?: InputMaybe<Identities_Set_Input>;
  where: Identities_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Identities_By_PkArgs = {
  _append?: InputMaybe<Identities_Append_Input>;
  _delete_at_path?: InputMaybe<Identities_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Identities_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Identities_Delete_Key_Input>;
  _prepend?: InputMaybe<Identities_Prepend_Input>;
  _set?: InputMaybe<Identities_Set_Input>;
  pk_columns: Identities_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_PileArgs = {
  _set?: InputMaybe<Pile_Set_Input>;
  where: Pile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Pile_BookmarkArgs = {
  _set?: InputMaybe<Pile_Bookmark_Set_Input>;
  where: Pile_Bookmark_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Pile_Bookmark_By_PkArgs = {
  _set?: InputMaybe<Pile_Bookmark_Set_Input>;
  pk_columns: Pile_Bookmark_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Pile_By_PkArgs = {
  _set?: InputMaybe<Pile_Set_Input>;
  pk_columns: Pile_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Pile_ConsumerArgs = {
  _append?: InputMaybe<Pile_Consumer_Append_Input>;
  _delete_at_path?: InputMaybe<Pile_Consumer_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Pile_Consumer_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Pile_Consumer_Delete_Key_Input>;
  _prepend?: InputMaybe<Pile_Consumer_Prepend_Input>;
  _set?: InputMaybe<Pile_Consumer_Set_Input>;
  where: Pile_Consumer_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Pile_Consumer_By_PkArgs = {
  _append?: InputMaybe<Pile_Consumer_Append_Input>;
  _delete_at_path?: InputMaybe<Pile_Consumer_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Pile_Consumer_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Pile_Consumer_Delete_Key_Input>;
  _prepend?: InputMaybe<Pile_Consumer_Prepend_Input>;
  _set?: InputMaybe<Pile_Consumer_Set_Input>;
  pk_columns: Pile_Consumer_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Pile_UserArgs = {
  _set?: InputMaybe<Pile_User_Set_Input>;
  where: Pile_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Pile_User_By_PkArgs = {
  _set?: InputMaybe<Pile_User_Set_Input>;
  pk_columns: Pile_User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_TagArgs = {
  _set?: InputMaybe<Tag_Set_Input>;
  where: Tag_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Tag_By_PkArgs = {
  _set?: InputMaybe<Tag_Set_Input>;
  pk_columns: Tag_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_UserArgs = {
  _set?: InputMaybe<User_Set_Input>;
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_BookmarkArgs = {
  _set?: InputMaybe<User_Bookmark_Set_Input>;
  where: User_Bookmark_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Bookmark_By_PkArgs = {
  _set?: InputMaybe<User_Bookmark_Set_Input>;
  pk_columns: User_Bookmark_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_By_PkArgs = {
  _set?: InputMaybe<User_Set_Input>;
  pk_columns: User_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** An unorganized pile of bookmarks that have been collected. */
export type Pile = {
  __typename?: 'pile';
  id: Scalars['uuid'];
  name: Scalars['String'];
  /** An array relationship */
  pile_bookmarks: Array<Pile_Bookmark>;
  /** An aggregate relationship */
  pile_bookmarks_aggregate: Pile_Bookmark_Aggregate;
  /** An array relationship */
  pile_consumers: Array<Pile_Consumer>;
  /** An aggregate relationship */
  pile_consumers_aggregate: Pile_Consumer_Aggregate;
  /** An array relationship */
  pile_users: Array<Pile_User>;
  /** An aggregate relationship */
  pile_users_aggregate: Pile_User_Aggregate;
};


/** An unorganized pile of bookmarks that have been collected. */
export type PilePile_BookmarksArgs = {
  distinct_on?: InputMaybe<Array<Pile_Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Bookmark_Order_By>>;
  where?: InputMaybe<Pile_Bookmark_Bool_Exp>;
};


/** An unorganized pile of bookmarks that have been collected. */
export type PilePile_Bookmarks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pile_Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Bookmark_Order_By>>;
  where?: InputMaybe<Pile_Bookmark_Bool_Exp>;
};


/** An unorganized pile of bookmarks that have been collected. */
export type PilePile_ConsumersArgs = {
  distinct_on?: InputMaybe<Array<Pile_Consumer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Consumer_Order_By>>;
  where?: InputMaybe<Pile_Consumer_Bool_Exp>;
};


/** An unorganized pile of bookmarks that have been collected. */
export type PilePile_Consumers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pile_Consumer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Consumer_Order_By>>;
  where?: InputMaybe<Pile_Consumer_Bool_Exp>;
};


/** An unorganized pile of bookmarks that have been collected. */
export type PilePile_UsersArgs = {
  distinct_on?: InputMaybe<Array<Pile_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_User_Order_By>>;
  where?: InputMaybe<Pile_User_Bool_Exp>;
};


/** An unorganized pile of bookmarks that have been collected. */
export type PilePile_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pile_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_User_Order_By>>;
  where?: InputMaybe<Pile_User_Bool_Exp>;
};

/** aggregated selection of "pile" */
export type Pile_Aggregate = {
  __typename?: 'pile_aggregate';
  aggregate?: Maybe<Pile_Aggregate_Fields>;
  nodes: Array<Pile>;
};

/** aggregate fields of "pile" */
export type Pile_Aggregate_Fields = {
  __typename?: 'pile_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Pile_Max_Fields>;
  min?: Maybe<Pile_Min_Fields>;
};


/** aggregate fields of "pile" */
export type Pile_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pile_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** A bookmark for a pile. */
export type Pile_Bookmark = {
  __typename?: 'pile_bookmark';
  /** An object relationship */
  bookmark: Bookmark;
  bookmark_id: Scalars['uuid'];
  /** An object relationship */
  contributor?: Maybe<User>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  /** An object relationship */
  pile: Pile;
  pile_id: Scalars['uuid'];
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregated selection of "pile_bookmark" */
export type Pile_Bookmark_Aggregate = {
  __typename?: 'pile_bookmark_aggregate';
  aggregate?: Maybe<Pile_Bookmark_Aggregate_Fields>;
  nodes: Array<Pile_Bookmark>;
};

/** aggregate fields of "pile_bookmark" */
export type Pile_Bookmark_Aggregate_Fields = {
  __typename?: 'pile_bookmark_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Pile_Bookmark_Max_Fields>;
  min?: Maybe<Pile_Bookmark_Min_Fields>;
};


/** aggregate fields of "pile_bookmark" */
export type Pile_Bookmark_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pile_Bookmark_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "pile_bookmark" */
export type Pile_Bookmark_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Pile_Bookmark_Max_Order_By>;
  min?: InputMaybe<Pile_Bookmark_Min_Order_By>;
};

/** input type for inserting array relation for remote table "pile_bookmark" */
export type Pile_Bookmark_Arr_Rel_Insert_Input = {
  data: Array<Pile_Bookmark_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Pile_Bookmark_On_Conflict>;
};

/** Boolean expression to filter rows from the table "pile_bookmark". All fields are combined with a logical 'AND'. */
export type Pile_Bookmark_Bool_Exp = {
  _and?: InputMaybe<Array<Pile_Bookmark_Bool_Exp>>;
  _not?: InputMaybe<Pile_Bookmark_Bool_Exp>;
  _or?: InputMaybe<Array<Pile_Bookmark_Bool_Exp>>;
  bookmark?: InputMaybe<Bookmark_Bool_Exp>;
  bookmark_id?: InputMaybe<Uuid_Comparison_Exp>;
  contributor?: InputMaybe<User_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  pile?: InputMaybe<Pile_Bool_Exp>;
  pile_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "pile_bookmark" */
export enum Pile_Bookmark_Constraint {
  /** unique or primary key constraint */
  PileBookmarkPkey = 'pile_bookmark_pkey'
}

/** input type for inserting data into table "pile_bookmark" */
export type Pile_Bookmark_Insert_Input = {
  bookmark?: InputMaybe<Bookmark_Obj_Rel_Insert_Input>;
  bookmark_id?: InputMaybe<Scalars['uuid']>;
  contributor?: InputMaybe<User_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  pile?: InputMaybe<Pile_Obj_Rel_Insert_Input>;
  pile_id?: InputMaybe<Scalars['uuid']>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Pile_Bookmark_Max_Fields = {
  __typename?: 'pile_bookmark_max_fields';
  bookmark_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  pile_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "pile_bookmark" */
export type Pile_Bookmark_Max_Order_By = {
  bookmark_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  pile_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Pile_Bookmark_Min_Fields = {
  __typename?: 'pile_bookmark_min_fields';
  bookmark_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  pile_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "pile_bookmark" */
export type Pile_Bookmark_Min_Order_By = {
  bookmark_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  pile_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "pile_bookmark" */
export type Pile_Bookmark_Mutation_Response = {
  __typename?: 'pile_bookmark_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Pile_Bookmark>;
};

/** on_conflict condition type for table "pile_bookmark" */
export type Pile_Bookmark_On_Conflict = {
  constraint: Pile_Bookmark_Constraint;
  update_columns?: Array<Pile_Bookmark_Update_Column>;
  where?: InputMaybe<Pile_Bookmark_Bool_Exp>;
};

/** Ordering options when selecting data from "pile_bookmark". */
export type Pile_Bookmark_Order_By = {
  bookmark?: InputMaybe<Bookmark_Order_By>;
  bookmark_id?: InputMaybe<Order_By>;
  contributor?: InputMaybe<User_Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  pile?: InputMaybe<Pile_Order_By>;
  pile_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: pile_bookmark */
export type Pile_Bookmark_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "pile_bookmark" */
export enum Pile_Bookmark_Select_Column {
  /** column name */
  BookmarkId = 'bookmark_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PileId = 'pile_id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "pile_bookmark" */
export type Pile_Bookmark_Set_Input = {
  bookmark_id?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  pile_id?: InputMaybe<Scalars['uuid']>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "pile_bookmark" */
export enum Pile_Bookmark_Update_Column {
  /** column name */
  BookmarkId = 'bookmark_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PileId = 'pile_id',
  /** column name */
  UserId = 'user_id'
}

/** Boolean expression to filter rows from the table "pile". All fields are combined with a logical 'AND'. */
export type Pile_Bool_Exp = {
  _and?: InputMaybe<Array<Pile_Bool_Exp>>;
  _not?: InputMaybe<Pile_Bool_Exp>;
  _or?: InputMaybe<Array<Pile_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  pile_bookmarks?: InputMaybe<Pile_Bookmark_Bool_Exp>;
  pile_consumers?: InputMaybe<Pile_Consumer_Bool_Exp>;
  pile_users?: InputMaybe<Pile_User_Bool_Exp>;
};

/** unique or primary key constraints on table "pile" */
export enum Pile_Constraint {
  /** unique or primary key constraint */
  BookmarkPilePkey = 'bookmark_pile_pkey'
}

/** A consumer for bookmarks that are added to a pile. */
export type Pile_Consumer = {
  __typename?: 'pile_consumer';
  config: Scalars['jsonb'];
  id: Scalars['uuid'];
  /** An object relationship */
  pile: Pile;
  pile_id: Scalars['uuid'];
  type?: Maybe<Scalars['pile_consumer_type']>;
};


/** A consumer for bookmarks that are added to a pile. */
export type Pile_ConsumerConfigArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "pile_consumer" */
export type Pile_Consumer_Aggregate = {
  __typename?: 'pile_consumer_aggregate';
  aggregate?: Maybe<Pile_Consumer_Aggregate_Fields>;
  nodes: Array<Pile_Consumer>;
};

/** aggregate fields of "pile_consumer" */
export type Pile_Consumer_Aggregate_Fields = {
  __typename?: 'pile_consumer_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Pile_Consumer_Max_Fields>;
  min?: Maybe<Pile_Consumer_Min_Fields>;
};


/** aggregate fields of "pile_consumer" */
export type Pile_Consumer_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pile_Consumer_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "pile_consumer" */
export type Pile_Consumer_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Pile_Consumer_Max_Order_By>;
  min?: InputMaybe<Pile_Consumer_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Pile_Consumer_Append_Input = {
  config?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "pile_consumer" */
export type Pile_Consumer_Arr_Rel_Insert_Input = {
  data: Array<Pile_Consumer_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Pile_Consumer_On_Conflict>;
};

/** Boolean expression to filter rows from the table "pile_consumer". All fields are combined with a logical 'AND'. */
export type Pile_Consumer_Bool_Exp = {
  _and?: InputMaybe<Array<Pile_Consumer_Bool_Exp>>;
  _not?: InputMaybe<Pile_Consumer_Bool_Exp>;
  _or?: InputMaybe<Array<Pile_Consumer_Bool_Exp>>;
  config?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  pile?: InputMaybe<Pile_Bool_Exp>;
  pile_id?: InputMaybe<Uuid_Comparison_Exp>;
  type?: InputMaybe<Pile_Consumer_Type_Comparison_Exp>;
};

/** unique or primary key constraints on table "pile_consumer" */
export enum Pile_Consumer_Constraint {
  /** unique or primary key constraint */
  PileConsumerPkey = 'pile_consumer_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Pile_Consumer_Delete_At_Path_Input = {
  config?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Pile_Consumer_Delete_Elem_Input = {
  config?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Pile_Consumer_Delete_Key_Input = {
  config?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "pile_consumer" */
export type Pile_Consumer_Insert_Input = {
  config?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  pile?: InputMaybe<Pile_Obj_Rel_Insert_Input>;
  pile_id?: InputMaybe<Scalars['uuid']>;
  type?: InputMaybe<Scalars['pile_consumer_type']>;
};

/** aggregate max on columns */
export type Pile_Consumer_Max_Fields = {
  __typename?: 'pile_consumer_max_fields';
  id?: Maybe<Scalars['uuid']>;
  pile_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "pile_consumer" */
export type Pile_Consumer_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  pile_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Pile_Consumer_Min_Fields = {
  __typename?: 'pile_consumer_min_fields';
  id?: Maybe<Scalars['uuid']>;
  pile_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "pile_consumer" */
export type Pile_Consumer_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  pile_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "pile_consumer" */
export type Pile_Consumer_Mutation_Response = {
  __typename?: 'pile_consumer_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Pile_Consumer>;
};

/** on_conflict condition type for table "pile_consumer" */
export type Pile_Consumer_On_Conflict = {
  constraint: Pile_Consumer_Constraint;
  update_columns?: Array<Pile_Consumer_Update_Column>;
  where?: InputMaybe<Pile_Consumer_Bool_Exp>;
};

/** Ordering options when selecting data from "pile_consumer". */
export type Pile_Consumer_Order_By = {
  config?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  pile?: InputMaybe<Pile_Order_By>;
  pile_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: pile_consumer */
export type Pile_Consumer_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Pile_Consumer_Prepend_Input = {
  config?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "pile_consumer" */
export enum Pile_Consumer_Select_Column {
  /** column name */
  Config = 'config',
  /** column name */
  Id = 'id',
  /** column name */
  PileId = 'pile_id',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "pile_consumer" */
export type Pile_Consumer_Set_Input = {
  config?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  pile_id?: InputMaybe<Scalars['uuid']>;
  type?: InputMaybe<Scalars['pile_consumer_type']>;
};

/** Boolean expression to compare columns of type "pile_consumer_type". All fields are combined with logical 'AND'. */
export type Pile_Consumer_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['pile_consumer_type']>;
  _gt?: InputMaybe<Scalars['pile_consumer_type']>;
  _gte?: InputMaybe<Scalars['pile_consumer_type']>;
  _in?: InputMaybe<Array<Scalars['pile_consumer_type']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['pile_consumer_type']>;
  _lte?: InputMaybe<Scalars['pile_consumer_type']>;
  _neq?: InputMaybe<Scalars['pile_consumer_type']>;
  _nin?: InputMaybe<Array<Scalars['pile_consumer_type']>>;
};

/** update columns of table "pile_consumer" */
export enum Pile_Consumer_Update_Column {
  /** column name */
  Config = 'config',
  /** column name */
  Id = 'id',
  /** column name */
  PileId = 'pile_id',
  /** column name */
  Type = 'type'
}

/** input type for inserting data into table "pile" */
export type Pile_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  pile_bookmarks?: InputMaybe<Pile_Bookmark_Arr_Rel_Insert_Input>;
  pile_consumers?: InputMaybe<Pile_Consumer_Arr_Rel_Insert_Input>;
  pile_users?: InputMaybe<Pile_User_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Pile_Max_Fields = {
  __typename?: 'pile_max_fields';
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Pile_Min_Fields = {
  __typename?: 'pile_min_fields';
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "pile" */
export type Pile_Mutation_Response = {
  __typename?: 'pile_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Pile>;
};

/** input type for inserting object relation for remote table "pile" */
export type Pile_Obj_Rel_Insert_Input = {
  data: Pile_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Pile_On_Conflict>;
};

/** on_conflict condition type for table "pile" */
export type Pile_On_Conflict = {
  constraint: Pile_Constraint;
  update_columns?: Array<Pile_Update_Column>;
  where?: InputMaybe<Pile_Bool_Exp>;
};

/** Ordering options when selecting data from "pile". */
export type Pile_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  pile_bookmarks_aggregate?: InputMaybe<Pile_Bookmark_Aggregate_Order_By>;
  pile_consumers_aggregate?: InputMaybe<Pile_Consumer_Aggregate_Order_By>;
  pile_users_aggregate?: InputMaybe<Pile_User_Aggregate_Order_By>;
};

/** primary key columns input for table: pile */
export type Pile_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "pile" */
export enum Pile_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "pile" */
export type Pile_Set_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "pile" */
export enum Pile_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** User association to a pile. */
export type Pile_User = {
  __typename?: 'pile_user';
  id: Scalars['uuid'];
  pile_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};

/** aggregated selection of "pile_user" */
export type Pile_User_Aggregate = {
  __typename?: 'pile_user_aggregate';
  aggregate?: Maybe<Pile_User_Aggregate_Fields>;
  nodes: Array<Pile_User>;
};

/** aggregate fields of "pile_user" */
export type Pile_User_Aggregate_Fields = {
  __typename?: 'pile_user_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Pile_User_Max_Fields>;
  min?: Maybe<Pile_User_Min_Fields>;
};


/** aggregate fields of "pile_user" */
export type Pile_User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pile_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "pile_user" */
export type Pile_User_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Pile_User_Max_Order_By>;
  min?: InputMaybe<Pile_User_Min_Order_By>;
};

/** input type for inserting array relation for remote table "pile_user" */
export type Pile_User_Arr_Rel_Insert_Input = {
  data: Array<Pile_User_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Pile_User_On_Conflict>;
};

/** Boolean expression to filter rows from the table "pile_user". All fields are combined with a logical 'AND'. */
export type Pile_User_Bool_Exp = {
  _and?: InputMaybe<Array<Pile_User_Bool_Exp>>;
  _not?: InputMaybe<Pile_User_Bool_Exp>;
  _or?: InputMaybe<Array<Pile_User_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  pile_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "pile_user" */
export enum Pile_User_Constraint {
  /** unique or primary key constraint */
  PileUserPkey = 'pile_user_pkey'
}

/** input type for inserting data into table "pile_user" */
export type Pile_User_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  pile_id?: InputMaybe<Scalars['uuid']>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Pile_User_Max_Fields = {
  __typename?: 'pile_user_max_fields';
  id?: Maybe<Scalars['uuid']>;
  pile_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "pile_user" */
export type Pile_User_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  pile_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Pile_User_Min_Fields = {
  __typename?: 'pile_user_min_fields';
  id?: Maybe<Scalars['uuid']>;
  pile_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "pile_user" */
export type Pile_User_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  pile_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "pile_user" */
export type Pile_User_Mutation_Response = {
  __typename?: 'pile_user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Pile_User>;
};

/** on_conflict condition type for table "pile_user" */
export type Pile_User_On_Conflict = {
  constraint: Pile_User_Constraint;
  update_columns?: Array<Pile_User_Update_Column>;
  where?: InputMaybe<Pile_User_Bool_Exp>;
};

/** Ordering options when selecting data from "pile_user". */
export type Pile_User_Order_By = {
  id?: InputMaybe<Order_By>;
  pile_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: pile_user */
export type Pile_User_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "pile_user" */
export enum Pile_User_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  PileId = 'pile_id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "pile_user" */
export type Pile_User_Set_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  pile_id?: InputMaybe<Scalars['uuid']>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "pile_user" */
export enum Pile_User_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  PileId = 'pile_id',
  /** column name */
  UserId = 'user_id'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "bookmark" */
  bookmark: Array<Bookmark>;
  bookmarkQuery: BookmarkQueryResponse;
  /** fetch aggregated fields from the table: "bookmark" */
  bookmark_aggregate: Bookmark_Aggregate;
  /** fetch data from the table: "bookmark" using primary key columns */
  bookmark_by_pk?: Maybe<Bookmark>;
  /** fetch data from the table: "bookmark_tag" */
  bookmark_tag: Array<Bookmark_Tag>;
  /** fetch aggregated fields from the table: "bookmark_tag" */
  bookmark_tag_aggregate: Bookmark_Tag_Aggregate;
  /** fetch data from the table: "bookmark_tag" using primary key columns */
  bookmark_tag_by_pk?: Maybe<Bookmark_Tag>;
  /** fetch data from the table: "identities" */
  identities: Array<Identities>;
  /** fetch aggregated fields from the table: "identities" */
  identities_aggregate: Identities_Aggregate;
  /** fetch data from the table: "identities" using primary key columns */
  identities_by_pk?: Maybe<Identities>;
  /** fetch data from the table: "pile" */
  pile: Array<Pile>;
  /** fetch aggregated fields from the table: "pile" */
  pile_aggregate: Pile_Aggregate;
  /** fetch data from the table: "pile_bookmark" */
  pile_bookmark: Array<Pile_Bookmark>;
  /** fetch aggregated fields from the table: "pile_bookmark" */
  pile_bookmark_aggregate: Pile_Bookmark_Aggregate;
  /** fetch data from the table: "pile_bookmark" using primary key columns */
  pile_bookmark_by_pk?: Maybe<Pile_Bookmark>;
  /** fetch data from the table: "pile" using primary key columns */
  pile_by_pk?: Maybe<Pile>;
  /** fetch data from the table: "pile_consumer" */
  pile_consumer: Array<Pile_Consumer>;
  /** fetch aggregated fields from the table: "pile_consumer" */
  pile_consumer_aggregate: Pile_Consumer_Aggregate;
  /** fetch data from the table: "pile_consumer" using primary key columns */
  pile_consumer_by_pk?: Maybe<Pile_Consumer>;
  /** fetch data from the table: "pile_user" */
  pile_user: Array<Pile_User>;
  /** fetch aggregated fields from the table: "pile_user" */
  pile_user_aggregate: Pile_User_Aggregate;
  /** fetch data from the table: "pile_user" using primary key columns */
  pile_user_by_pk?: Maybe<Pile_User>;
  /** fetch data from the table: "tag" */
  tag: Array<Tag>;
  /** fetch aggregated fields from the table: "tag" */
  tag_aggregate: Tag_Aggregate;
  /** fetch data from the table: "tag" using primary key columns */
  tag_by_pk?: Maybe<Tag>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user_bookmark" */
  user_bookmark: Array<User_Bookmark>;
  /** fetch aggregated fields from the table: "user_bookmark" */
  user_bookmark_aggregate: User_Bookmark_Aggregate;
  /** fetch data from the table: "user_bookmark" using primary key columns */
  user_bookmark_by_pk?: Maybe<User_Bookmark>;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
};


export type Query_RootBookmarkArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Order_By>>;
  where?: InputMaybe<Bookmark_Bool_Exp>;
};


export type Query_RootBookmarkQueryArgs = {
  q?: InputMaybe<BookmarkQueryRequest>;
};


export type Query_RootBookmark_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Order_By>>;
  where?: InputMaybe<Bookmark_Bool_Exp>;
};


export type Query_RootBookmark_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootBookmark_TagArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Tag_Order_By>>;
  where?: InputMaybe<Bookmark_Tag_Bool_Exp>;
};


export type Query_RootBookmark_Tag_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Tag_Order_By>>;
  where?: InputMaybe<Bookmark_Tag_Bool_Exp>;
};


export type Query_RootBookmark_Tag_By_PkArgs = {
  bookmark_id: Scalars['uuid'];
  tag_id: Scalars['uuid'];
};


export type Query_RootIdentitiesArgs = {
  distinct_on?: InputMaybe<Array<Identities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identities_Order_By>>;
  where?: InputMaybe<Identities_Bool_Exp>;
};


export type Query_RootIdentities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Identities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identities_Order_By>>;
  where?: InputMaybe<Identities_Bool_Exp>;
};


export type Query_RootIdentities_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootPileArgs = {
  distinct_on?: InputMaybe<Array<Pile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Order_By>>;
  where?: InputMaybe<Pile_Bool_Exp>;
};


export type Query_RootPile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Order_By>>;
  where?: InputMaybe<Pile_Bool_Exp>;
};


export type Query_RootPile_BookmarkArgs = {
  distinct_on?: InputMaybe<Array<Pile_Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Bookmark_Order_By>>;
  where?: InputMaybe<Pile_Bookmark_Bool_Exp>;
};


export type Query_RootPile_Bookmark_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pile_Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Bookmark_Order_By>>;
  where?: InputMaybe<Pile_Bookmark_Bool_Exp>;
};


export type Query_RootPile_Bookmark_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootPile_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootPile_ConsumerArgs = {
  distinct_on?: InputMaybe<Array<Pile_Consumer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Consumer_Order_By>>;
  where?: InputMaybe<Pile_Consumer_Bool_Exp>;
};


export type Query_RootPile_Consumer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pile_Consumer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Consumer_Order_By>>;
  where?: InputMaybe<Pile_Consumer_Bool_Exp>;
};


export type Query_RootPile_Consumer_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootPile_UserArgs = {
  distinct_on?: InputMaybe<Array<Pile_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_User_Order_By>>;
  where?: InputMaybe<Pile_User_Bool_Exp>;
};


export type Query_RootPile_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pile_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_User_Order_By>>;
  where?: InputMaybe<Pile_User_Bool_Exp>;
};


export type Query_RootPile_User_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootTagArgs = {
  distinct_on?: InputMaybe<Array<Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tag_Order_By>>;
  where?: InputMaybe<Tag_Bool_Exp>;
};


export type Query_RootTag_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tag_Order_By>>;
  where?: InputMaybe<Tag_Bool_Exp>;
};


export type Query_RootTag_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_BookmarkArgs = {
  distinct_on?: InputMaybe<Array<User_Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Bookmark_Order_By>>;
  where?: InputMaybe<User_Bookmark_Bool_Exp>;
};


export type Query_RootUser_Bookmark_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Bookmark_Order_By>>;
  where?: InputMaybe<User_Bookmark_Bool_Exp>;
};


export type Query_RootUser_Bookmark_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUser_By_PkArgs = {
  id: Scalars['uuid'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "bookmark" */
  bookmark: Array<Bookmark>;
  /** fetch aggregated fields from the table: "bookmark" */
  bookmark_aggregate: Bookmark_Aggregate;
  /** fetch data from the table: "bookmark" using primary key columns */
  bookmark_by_pk?: Maybe<Bookmark>;
  /** fetch data from the table: "bookmark_tag" */
  bookmark_tag: Array<Bookmark_Tag>;
  /** fetch aggregated fields from the table: "bookmark_tag" */
  bookmark_tag_aggregate: Bookmark_Tag_Aggregate;
  /** fetch data from the table: "bookmark_tag" using primary key columns */
  bookmark_tag_by_pk?: Maybe<Bookmark_Tag>;
  /** fetch data from the table: "identities" */
  identities: Array<Identities>;
  /** fetch aggregated fields from the table: "identities" */
  identities_aggregate: Identities_Aggregate;
  /** fetch data from the table: "identities" using primary key columns */
  identities_by_pk?: Maybe<Identities>;
  /** fetch data from the table: "pile" */
  pile: Array<Pile>;
  /** fetch aggregated fields from the table: "pile" */
  pile_aggregate: Pile_Aggregate;
  /** fetch data from the table: "pile_bookmark" */
  pile_bookmark: Array<Pile_Bookmark>;
  /** fetch aggregated fields from the table: "pile_bookmark" */
  pile_bookmark_aggregate: Pile_Bookmark_Aggregate;
  /** fetch data from the table: "pile_bookmark" using primary key columns */
  pile_bookmark_by_pk?: Maybe<Pile_Bookmark>;
  /** fetch data from the table: "pile" using primary key columns */
  pile_by_pk?: Maybe<Pile>;
  /** fetch data from the table: "pile_consumer" */
  pile_consumer: Array<Pile_Consumer>;
  /** fetch aggregated fields from the table: "pile_consumer" */
  pile_consumer_aggregate: Pile_Consumer_Aggregate;
  /** fetch data from the table: "pile_consumer" using primary key columns */
  pile_consumer_by_pk?: Maybe<Pile_Consumer>;
  /** fetch data from the table: "pile_user" */
  pile_user: Array<Pile_User>;
  /** fetch aggregated fields from the table: "pile_user" */
  pile_user_aggregate: Pile_User_Aggregate;
  /** fetch data from the table: "pile_user" using primary key columns */
  pile_user_by_pk?: Maybe<Pile_User>;
  /** fetch data from the table: "tag" */
  tag: Array<Tag>;
  /** fetch aggregated fields from the table: "tag" */
  tag_aggregate: Tag_Aggregate;
  /** fetch data from the table: "tag" using primary key columns */
  tag_by_pk?: Maybe<Tag>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user_bookmark" */
  user_bookmark: Array<User_Bookmark>;
  /** fetch aggregated fields from the table: "user_bookmark" */
  user_bookmark_aggregate: User_Bookmark_Aggregate;
  /** fetch data from the table: "user_bookmark" using primary key columns */
  user_bookmark_by_pk?: Maybe<User_Bookmark>;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
};


export type Subscription_RootBookmarkArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Order_By>>;
  where?: InputMaybe<Bookmark_Bool_Exp>;
};


export type Subscription_RootBookmark_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Order_By>>;
  where?: InputMaybe<Bookmark_Bool_Exp>;
};


export type Subscription_RootBookmark_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootBookmark_TagArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Tag_Order_By>>;
  where?: InputMaybe<Bookmark_Tag_Bool_Exp>;
};


export type Subscription_RootBookmark_Tag_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Tag_Order_By>>;
  where?: InputMaybe<Bookmark_Tag_Bool_Exp>;
};


export type Subscription_RootBookmark_Tag_By_PkArgs = {
  bookmark_id: Scalars['uuid'];
  tag_id: Scalars['uuid'];
};


export type Subscription_RootIdentitiesArgs = {
  distinct_on?: InputMaybe<Array<Identities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identities_Order_By>>;
  where?: InputMaybe<Identities_Bool_Exp>;
};


export type Subscription_RootIdentities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Identities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identities_Order_By>>;
  where?: InputMaybe<Identities_Bool_Exp>;
};


export type Subscription_RootIdentities_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootPileArgs = {
  distinct_on?: InputMaybe<Array<Pile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Order_By>>;
  where?: InputMaybe<Pile_Bool_Exp>;
};


export type Subscription_RootPile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Order_By>>;
  where?: InputMaybe<Pile_Bool_Exp>;
};


export type Subscription_RootPile_BookmarkArgs = {
  distinct_on?: InputMaybe<Array<Pile_Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Bookmark_Order_By>>;
  where?: InputMaybe<Pile_Bookmark_Bool_Exp>;
};


export type Subscription_RootPile_Bookmark_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pile_Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Bookmark_Order_By>>;
  where?: InputMaybe<Pile_Bookmark_Bool_Exp>;
};


export type Subscription_RootPile_Bookmark_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootPile_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootPile_ConsumerArgs = {
  distinct_on?: InputMaybe<Array<Pile_Consumer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Consumer_Order_By>>;
  where?: InputMaybe<Pile_Consumer_Bool_Exp>;
};


export type Subscription_RootPile_Consumer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pile_Consumer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_Consumer_Order_By>>;
  where?: InputMaybe<Pile_Consumer_Bool_Exp>;
};


export type Subscription_RootPile_Consumer_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootPile_UserArgs = {
  distinct_on?: InputMaybe<Array<Pile_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_User_Order_By>>;
  where?: InputMaybe<Pile_User_Bool_Exp>;
};


export type Subscription_RootPile_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pile_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Pile_User_Order_By>>;
  where?: InputMaybe<Pile_User_Bool_Exp>;
};


export type Subscription_RootPile_User_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootTagArgs = {
  distinct_on?: InputMaybe<Array<Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tag_Order_By>>;
  where?: InputMaybe<Tag_Bool_Exp>;
};


export type Subscription_RootTag_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tag_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tag_Order_By>>;
  where?: InputMaybe<Tag_Bool_Exp>;
};


export type Subscription_RootTag_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_BookmarkArgs = {
  distinct_on?: InputMaybe<Array<User_Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Bookmark_Order_By>>;
  where?: InputMaybe<User_Bookmark_Bool_Exp>;
};


export type Subscription_RootUser_Bookmark_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Bookmark_Order_By>>;
  where?: InputMaybe<User_Bookmark_Bool_Exp>;
};


export type Subscription_RootUser_Bookmark_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUser_By_PkArgs = {
  id: Scalars['uuid'];
};

/** columns and relationships of "tag" */
export type Tag = {
  __typename?: 'tag';
  id: Scalars['uuid'];
  name: Scalars['String'];
};

/** aggregated selection of "tag" */
export type Tag_Aggregate = {
  __typename?: 'tag_aggregate';
  aggregate?: Maybe<Tag_Aggregate_Fields>;
  nodes: Array<Tag>;
};

/** aggregate fields of "tag" */
export type Tag_Aggregate_Fields = {
  __typename?: 'tag_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Tag_Max_Fields>;
  min?: Maybe<Tag_Min_Fields>;
};


/** aggregate fields of "tag" */
export type Tag_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Tag_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "tag". All fields are combined with a logical 'AND'. */
export type Tag_Bool_Exp = {
  _and?: InputMaybe<Array<Tag_Bool_Exp>>;
  _not?: InputMaybe<Tag_Bool_Exp>;
  _or?: InputMaybe<Array<Tag_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "tag" */
export enum Tag_Constraint {
  /** unique or primary key constraint */
  TagNameUnique = 'tag_name_unique',
  /** unique or primary key constraint */
  TagPkey = 'tag_pkey'
}

/** input type for inserting data into table "tag" */
export type Tag_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Tag_Max_Fields = {
  __typename?: 'tag_max_fields';
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Tag_Min_Fields = {
  __typename?: 'tag_min_fields';
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "tag" */
export type Tag_Mutation_Response = {
  __typename?: 'tag_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Tag>;
};

/** on_conflict condition type for table "tag" */
export type Tag_On_Conflict = {
  constraint: Tag_Constraint;
  update_columns?: Array<Tag_Update_Column>;
  where?: InputMaybe<Tag_Bool_Exp>;
};

/** Ordering options when selecting data from "tag". */
export type Tag_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: tag */
export type Tag_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "tag" */
export enum Tag_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "tag" */
export type Tag_Set_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "tag" */
export enum Tag_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']>;
  _gt?: InputMaybe<Scalars['timestamp']>;
  _gte?: InputMaybe<Scalars['timestamp']>;
  _in?: InputMaybe<Array<Scalars['timestamp']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamp']>;
  _lte?: InputMaybe<Scalars['timestamp']>;
  _neq?: InputMaybe<Scalars['timestamp']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** Users for Sifty */
export type User = {
  __typename?: 'user';
  id: Scalars['uuid'];
  /** An object relationship */
  identity: Identities;
  kratos_id: Scalars['uuid'];
  /** An array relationship */
  user_bookmarks: Array<User_Bookmark>;
  /** An aggregate relationship */
  user_bookmarks_aggregate: User_Bookmark_Aggregate;
};


/** Users for Sifty */
export type UserUser_BookmarksArgs = {
  distinct_on?: InputMaybe<Array<User_Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Bookmark_Order_By>>;
  where?: InputMaybe<User_Bookmark_Bool_Exp>;
};


/** Users for Sifty */
export type UserUser_Bookmarks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Bookmark_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Bookmark_Order_By>>;
  where?: InputMaybe<User_Bookmark_Bool_Exp>;
};

/** aggregated selection of "user" */
export type User_Aggregate = {
  __typename?: 'user_aggregate';
  aggregate?: Maybe<User_Aggregate_Fields>;
  nodes: Array<User>;
};

/** aggregate fields of "user" */
export type User_Aggregate_Fields = {
  __typename?: 'user_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<User_Max_Fields>;
  min?: Maybe<User_Min_Fields>;
};


/** aggregate fields of "user" */
export type User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Bookmarks for a user */
export type User_Bookmark = {
  __typename?: 'user_bookmark';
  /** An object relationship */
  bookmark: Bookmark;
  bookmark_id: Scalars['uuid'];
  id: Scalars['uuid'];
  name?: Maybe<Scalars['String']>;
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
};

/** aggregated selection of "user_bookmark" */
export type User_Bookmark_Aggregate = {
  __typename?: 'user_bookmark_aggregate';
  aggregate?: Maybe<User_Bookmark_Aggregate_Fields>;
  nodes: Array<User_Bookmark>;
};

/** aggregate fields of "user_bookmark" */
export type User_Bookmark_Aggregate_Fields = {
  __typename?: 'user_bookmark_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<User_Bookmark_Max_Fields>;
  min?: Maybe<User_Bookmark_Min_Fields>;
};


/** aggregate fields of "user_bookmark" */
export type User_Bookmark_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Bookmark_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "user_bookmark" */
export type User_Bookmark_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<User_Bookmark_Max_Order_By>;
  min?: InputMaybe<User_Bookmark_Min_Order_By>;
};

/** input type for inserting array relation for remote table "user_bookmark" */
export type User_Bookmark_Arr_Rel_Insert_Input = {
  data: Array<User_Bookmark_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<User_Bookmark_On_Conflict>;
};

/** Boolean expression to filter rows from the table "user_bookmark". All fields are combined with a logical 'AND'. */
export type User_Bookmark_Bool_Exp = {
  _and?: InputMaybe<Array<User_Bookmark_Bool_Exp>>;
  _not?: InputMaybe<User_Bookmark_Bool_Exp>;
  _or?: InputMaybe<Array<User_Bookmark_Bool_Exp>>;
  bookmark?: InputMaybe<Bookmark_Bool_Exp>;
  bookmark_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<User_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_bookmark" */
export enum User_Bookmark_Constraint {
  /** unique or primary key constraint */
  UserBookmarkPkey = 'user_bookmark_pkey'
}

/** input type for inserting data into table "user_bookmark" */
export type User_Bookmark_Insert_Input = {
  bookmark?: InputMaybe<Bookmark_Obj_Rel_Insert_Input>;
  bookmark_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<User_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type User_Bookmark_Max_Fields = {
  __typename?: 'user_bookmark_max_fields';
  bookmark_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "user_bookmark" */
export type User_Bookmark_Max_Order_By = {
  bookmark_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type User_Bookmark_Min_Fields = {
  __typename?: 'user_bookmark_min_fields';
  bookmark_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "user_bookmark" */
export type User_Bookmark_Min_Order_By = {
  bookmark_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "user_bookmark" */
export type User_Bookmark_Mutation_Response = {
  __typename?: 'user_bookmark_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Bookmark>;
};

/** on_conflict condition type for table "user_bookmark" */
export type User_Bookmark_On_Conflict = {
  constraint: User_Bookmark_Constraint;
  update_columns?: Array<User_Bookmark_Update_Column>;
  where?: InputMaybe<User_Bookmark_Bool_Exp>;
};

/** Ordering options when selecting data from "user_bookmark". */
export type User_Bookmark_Order_By = {
  bookmark?: InputMaybe<Bookmark_Order_By>;
  bookmark_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  user?: InputMaybe<User_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user_bookmark */
export type User_Bookmark_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "user_bookmark" */
export enum User_Bookmark_Select_Column {
  /** column name */
  BookmarkId = 'bookmark_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "user_bookmark" */
export type User_Bookmark_Set_Input = {
  bookmark_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "user_bookmark" */
export enum User_Bookmark_Update_Column {
  /** column name */
  BookmarkId = 'bookmark_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UserId = 'user_id'
}

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export type User_Bool_Exp = {
  _and?: InputMaybe<Array<User_Bool_Exp>>;
  _not?: InputMaybe<User_Bool_Exp>;
  _or?: InputMaybe<Array<User_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  identity?: InputMaybe<Identities_Bool_Exp>;
  kratos_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_bookmarks?: InputMaybe<User_Bookmark_Bool_Exp>;
};

/** unique or primary key constraints on table "user" */
export enum User_Constraint {
  /** unique or primary key constraint */
  UserKratosIdKey = 'user_kratos_id_key',
  /** unique or primary key constraint */
  UserPkey = 'user_pkey'
}

/** input type for inserting data into table "user" */
export type User_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  identity?: InputMaybe<Identities_Obj_Rel_Insert_Input>;
  kratos_id?: InputMaybe<Scalars['uuid']>;
  user_bookmarks?: InputMaybe<User_Bookmark_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type User_Max_Fields = {
  __typename?: 'user_max_fields';
  id?: Maybe<Scalars['uuid']>;
  kratos_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type User_Min_Fields = {
  __typename?: 'user_min_fields';
  id?: Maybe<Scalars['uuid']>;
  kratos_id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "user" */
export type User_Mutation_Response = {
  __typename?: 'user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User>;
};

/** input type for inserting object relation for remote table "user" */
export type User_Obj_Rel_Insert_Input = {
  data: User_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<User_On_Conflict>;
};

/** on_conflict condition type for table "user" */
export type User_On_Conflict = {
  constraint: User_Constraint;
  update_columns?: Array<User_Update_Column>;
  where?: InputMaybe<User_Bool_Exp>;
};

/** Ordering options when selecting data from "user". */
export type User_Order_By = {
  id?: InputMaybe<Order_By>;
  identity?: InputMaybe<Identities_Order_By>;
  kratos_id?: InputMaybe<Order_By>;
  user_bookmarks_aggregate?: InputMaybe<User_Bookmark_Aggregate_Order_By>;
};

/** primary key columns input for table: user */
export type User_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "user" */
export enum User_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  KratosId = 'kratos_id'
}

/** input type for updating data in table "user" */
export type User_Set_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  kratos_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "user" */
export enum User_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  KratosId = 'kratos_id'
}

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

export type GetBookmarkQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetBookmarkQuery = { __typename?: 'query_root', bookmark_by_pk?: { __typename?: 'bookmark', url: string, title: string, public: boolean, modified: any, id: any, html: string, excerpt: string, content: string, author: string } | null };

export type GetBookmarksQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type GetBookmarksQuery = { __typename?: 'query_root', bookmark: Array<{ __typename?: 'bookmark', id: any, title: string, url: string, public: boolean, excerpt: string, modified: any, author: string }> };

export type NewPileMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type NewPileMutation = { __typename?: 'mutation_root', insert_pile_one?: { __typename?: 'pile', id: any } | null };

export type SaveBookmarkByUrlMutationVariables = Exact<{
  url: Scalars['String'];
}>;


export type SaveBookmarkByUrlMutation = { __typename?: 'mutation_root', saveBookmark: { __typename?: 'SavedBookmark', title: string } };


export const GetBookmarkDocument = gql`
    query GetBookmark($id: uuid!) {
  bookmark_by_pk(id: $id) {
    url
    title
    public
    modified
    id
    html
    excerpt
    content
    author
  }
}
    `;

/**
 * __useGetBookmarkQuery__
 *
 * To run a query within a React component, call `useGetBookmarkQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBookmarkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBookmarkQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBookmarkQuery(baseOptions: Apollo.QueryHookOptions<GetBookmarkQuery, GetBookmarkQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBookmarkQuery, GetBookmarkQueryVariables>(GetBookmarkDocument, options);
      }
export function useGetBookmarkLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBookmarkQuery, GetBookmarkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBookmarkQuery, GetBookmarkQueryVariables>(GetBookmarkDocument, options);
        }
export type GetBookmarkQueryHookResult = ReturnType<typeof useGetBookmarkQuery>;
export type GetBookmarkLazyQueryHookResult = ReturnType<typeof useGetBookmarkLazyQuery>;
export type GetBookmarkQueryResult = Apollo.QueryResult<GetBookmarkQuery, GetBookmarkQueryVariables>;
export const GetBookmarksDocument = gql`
    query GetBookmarks($limit: Int = 10) {
  bookmark(limit: $limit) {
    id
    title
    url
    public
    excerpt
    modified
    author
  }
}
    `;

/**
 * __useGetBookmarksQuery__
 *
 * To run a query within a React component, call `useGetBookmarksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBookmarksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBookmarksQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetBookmarksQuery(baseOptions?: Apollo.QueryHookOptions<GetBookmarksQuery, GetBookmarksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBookmarksQuery, GetBookmarksQueryVariables>(GetBookmarksDocument, options);
      }
export function useGetBookmarksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBookmarksQuery, GetBookmarksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBookmarksQuery, GetBookmarksQueryVariables>(GetBookmarksDocument, options);
        }
export type GetBookmarksQueryHookResult = ReturnType<typeof useGetBookmarksQuery>;
export type GetBookmarksLazyQueryHookResult = ReturnType<typeof useGetBookmarksLazyQuery>;
export type GetBookmarksQueryResult = Apollo.QueryResult<GetBookmarksQuery, GetBookmarksQueryVariables>;
export const NewPileDocument = gql`
    mutation NewPile($name: String!) {
  insert_pile_one(object: {name: $name}) {
    id
  }
}
    `;
export type NewPileMutationFn = Apollo.MutationFunction<NewPileMutation, NewPileMutationVariables>;

/**
 * __useNewPileMutation__
 *
 * To run a mutation, you first call `useNewPileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNewPileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [newPileMutation, { data, loading, error }] = useNewPileMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useNewPileMutation(baseOptions?: Apollo.MutationHookOptions<NewPileMutation, NewPileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<NewPileMutation, NewPileMutationVariables>(NewPileDocument, options);
      }
export type NewPileMutationHookResult = ReturnType<typeof useNewPileMutation>;
export type NewPileMutationResult = Apollo.MutationResult<NewPileMutation>;
export type NewPileMutationOptions = Apollo.BaseMutationOptions<NewPileMutation, NewPileMutationVariables>;
export const SaveBookmarkByUrlDocument = gql`
    mutation SaveBookmarkByUrl($url: String!) {
  saveBookmark(input: {url: $url}) {
    title
  }
}
    `;
export type SaveBookmarkByUrlMutationFn = Apollo.MutationFunction<SaveBookmarkByUrlMutation, SaveBookmarkByUrlMutationVariables>;

/**
 * __useSaveBookmarkByUrlMutation__
 *
 * To run a mutation, you first call `useSaveBookmarkByUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveBookmarkByUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveBookmarkByUrlMutation, { data, loading, error }] = useSaveBookmarkByUrlMutation({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useSaveBookmarkByUrlMutation(baseOptions?: Apollo.MutationHookOptions<SaveBookmarkByUrlMutation, SaveBookmarkByUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveBookmarkByUrlMutation, SaveBookmarkByUrlMutationVariables>(SaveBookmarkByUrlDocument, options);
      }
export type SaveBookmarkByUrlMutationHookResult = ReturnType<typeof useSaveBookmarkByUrlMutation>;
export type SaveBookmarkByUrlMutationResult = Apollo.MutationResult<SaveBookmarkByUrlMutation>;
export type SaveBookmarkByUrlMutationOptions = Apollo.BaseMutationOptions<SaveBookmarkByUrlMutation, SaveBookmarkByUrlMutationVariables>;