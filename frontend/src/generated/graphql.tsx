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
  timestamp: any;
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

/** columns and relationships of "bookmark_tags" */
export type Bookmark_Tags = {
  __typename?: 'bookmark_tags';
  bookmark_id: Scalars['uuid'];
  tag_id: Scalars['uuid'];
};

/** aggregated selection of "bookmark_tags" */
export type Bookmark_Tags_Aggregate = {
  __typename?: 'bookmark_tags_aggregate';
  aggregate?: Maybe<Bookmark_Tags_Aggregate_Fields>;
  nodes: Array<Bookmark_Tags>;
};

/** aggregate fields of "bookmark_tags" */
export type Bookmark_Tags_Aggregate_Fields = {
  __typename?: 'bookmark_tags_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Bookmark_Tags_Max_Fields>;
  min?: Maybe<Bookmark_Tags_Min_Fields>;
};


/** aggregate fields of "bookmark_tags" */
export type Bookmark_Tags_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bookmark_Tags_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "bookmark_tags" */
export type Bookmark_Tags_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Bookmark_Tags_Max_Order_By>;
  min?: InputMaybe<Bookmark_Tags_Min_Order_By>;
};

/** input type for inserting array relation for remote table "bookmark_tags" */
export type Bookmark_Tags_Arr_Rel_Insert_Input = {
  data: Array<Bookmark_Tags_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Bookmark_Tags_On_Conflict>;
};

/** Boolean expression to filter rows from the table "bookmark_tags". All fields are combined with a logical 'AND'. */
export type Bookmark_Tags_Bool_Exp = {
  _and?: InputMaybe<Array<Bookmark_Tags_Bool_Exp>>;
  _not?: InputMaybe<Bookmark_Tags_Bool_Exp>;
  _or?: InputMaybe<Array<Bookmark_Tags_Bool_Exp>>;
  bookmark_id?: InputMaybe<Uuid_Comparison_Exp>;
  tag_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "bookmark_tags" */
export enum Bookmark_Tags_Constraint {
  /** unique or primary key constraint */
  BookmarkTagsPkey = 'bookmark_tags_pkey'
}

/** input type for inserting data into table "bookmark_tags" */
export type Bookmark_Tags_Insert_Input = {
  bookmark_id?: InputMaybe<Scalars['uuid']>;
  tag_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Bookmark_Tags_Max_Fields = {
  __typename?: 'bookmark_tags_max_fields';
  bookmark_id?: Maybe<Scalars['uuid']>;
  tag_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "bookmark_tags" */
export type Bookmark_Tags_Max_Order_By = {
  bookmark_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Bookmark_Tags_Min_Fields = {
  __typename?: 'bookmark_tags_min_fields';
  bookmark_id?: Maybe<Scalars['uuid']>;
  tag_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "bookmark_tags" */
export type Bookmark_Tags_Min_Order_By = {
  bookmark_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "bookmark_tags" */
export type Bookmark_Tags_Mutation_Response = {
  __typename?: 'bookmark_tags_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Bookmark_Tags>;
};

/** on_conflict condition type for table "bookmark_tags" */
export type Bookmark_Tags_On_Conflict = {
  constraint: Bookmark_Tags_Constraint;
  update_columns?: Array<Bookmark_Tags_Update_Column>;
  where?: InputMaybe<Bookmark_Tags_Bool_Exp>;
};

/** Ordering options when selecting data from "bookmark_tags". */
export type Bookmark_Tags_Order_By = {
  bookmark_id?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: bookmark_tags */
export type Bookmark_Tags_Pk_Columns_Input = {
  bookmark_id: Scalars['uuid'];
  tag_id: Scalars['uuid'];
};

/** select columns of table "bookmark_tags" */
export enum Bookmark_Tags_Select_Column {
  /** column name */
  BookmarkId = 'bookmark_id',
  /** column name */
  TagId = 'tag_id'
}

/** input type for updating data in table "bookmark_tags" */
export type Bookmark_Tags_Set_Input = {
  bookmark_id?: InputMaybe<Scalars['uuid']>;
  tag_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "bookmark_tags" */
export enum Bookmark_Tags_Update_Column {
  /** column name */
  BookmarkId = 'bookmark_id',
  /** column name */
  TagId = 'tag_id'
}

/** columns and relationships of "bookmarks" */
export type Bookmarks = {
  __typename?: 'bookmarks';
  author: Scalars['String'];
  /** An array relationship */
  bookmark_tags: Array<Bookmark_Tags>;
  /** An aggregate relationship */
  bookmark_tags_aggregate: Bookmark_Tags_Aggregate;
  content: Scalars['String'];
  excerpt: Scalars['String'];
  html: Scalars['String'];
  id: Scalars['uuid'];
  modified: Scalars['timestamp'];
  public: Scalars['Boolean'];
  title: Scalars['String'];
  url: Scalars['String'];
};


/** columns and relationships of "bookmarks" */
export type BookmarksBookmark_TagsArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Tags_Order_By>>;
  where?: InputMaybe<Bookmark_Tags_Bool_Exp>;
};


/** columns and relationships of "bookmarks" */
export type BookmarksBookmark_Tags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Tags_Order_By>>;
  where?: InputMaybe<Bookmark_Tags_Bool_Exp>;
};

/** aggregated selection of "bookmarks" */
export type Bookmarks_Aggregate = {
  __typename?: 'bookmarks_aggregate';
  aggregate?: Maybe<Bookmarks_Aggregate_Fields>;
  nodes: Array<Bookmarks>;
};

/** aggregate fields of "bookmarks" */
export type Bookmarks_Aggregate_Fields = {
  __typename?: 'bookmarks_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Bookmarks_Max_Fields>;
  min?: Maybe<Bookmarks_Min_Fields>;
};


/** aggregate fields of "bookmarks" */
export type Bookmarks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bookmarks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "bookmarks". All fields are combined with a logical 'AND'. */
export type Bookmarks_Bool_Exp = {
  _and?: InputMaybe<Array<Bookmarks_Bool_Exp>>;
  _not?: InputMaybe<Bookmarks_Bool_Exp>;
  _or?: InputMaybe<Array<Bookmarks_Bool_Exp>>;
  author?: InputMaybe<String_Comparison_Exp>;
  bookmark_tags?: InputMaybe<Bookmark_Tags_Bool_Exp>;
  content?: InputMaybe<String_Comparison_Exp>;
  excerpt?: InputMaybe<String_Comparison_Exp>;
  html?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  modified?: InputMaybe<Timestamp_Comparison_Exp>;
  public?: InputMaybe<Boolean_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "bookmarks" */
export enum Bookmarks_Constraint {
  /** unique or primary key constraint */
  BookmarkUrlUnique = 'bookmark_url_unique',
  /** unique or primary key constraint */
  BookmarksPkey = 'bookmarks_pkey'
}

/** input type for inserting data into table "bookmarks" */
export type Bookmarks_Insert_Input = {
  author?: InputMaybe<Scalars['String']>;
  bookmark_tags?: InputMaybe<Bookmark_Tags_Arr_Rel_Insert_Input>;
  content?: InputMaybe<Scalars['String']>;
  excerpt?: InputMaybe<Scalars['String']>;
  html?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  modified?: InputMaybe<Scalars['timestamp']>;
  public?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Bookmarks_Max_Fields = {
  __typename?: 'bookmarks_max_fields';
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
export type Bookmarks_Min_Fields = {
  __typename?: 'bookmarks_min_fields';
  author?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  html?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  modified?: Maybe<Scalars['timestamp']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "bookmarks" */
export type Bookmarks_Mutation_Response = {
  __typename?: 'bookmarks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Bookmarks>;
};

/** input type for inserting object relation for remote table "bookmarks" */
export type Bookmarks_Obj_Rel_Insert_Input = {
  data: Bookmarks_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Bookmarks_On_Conflict>;
};

/** on_conflict condition type for table "bookmarks" */
export type Bookmarks_On_Conflict = {
  constraint: Bookmarks_Constraint;
  update_columns?: Array<Bookmarks_Update_Column>;
  where?: InputMaybe<Bookmarks_Bool_Exp>;
};

/** Ordering options when selecting data from "bookmarks". */
export type Bookmarks_Order_By = {
  author?: InputMaybe<Order_By>;
  bookmark_tags_aggregate?: InputMaybe<Bookmark_Tags_Aggregate_Order_By>;
  content?: InputMaybe<Order_By>;
  excerpt?: InputMaybe<Order_By>;
  html?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  modified?: InputMaybe<Order_By>;
  public?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
};

/** primary key columns input for table: bookmarks */
export type Bookmarks_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "bookmarks" */
export enum Bookmarks_Select_Column {
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

/** input type for updating data in table "bookmarks" */
export type Bookmarks_Set_Input = {
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

/** update columns of table "bookmarks" */
export enum Bookmarks_Update_Column {
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
  /** delete data from the table: "bookmark_tags" */
  delete_bookmark_tags?: Maybe<Bookmark_Tags_Mutation_Response>;
  /** delete single row from the table: "bookmark_tags" */
  delete_bookmark_tags_by_pk?: Maybe<Bookmark_Tags>;
  /** delete data from the table: "bookmarks" */
  delete_bookmarks?: Maybe<Bookmarks_Mutation_Response>;
  /** delete single row from the table: "bookmarks" */
  delete_bookmarks_by_pk?: Maybe<Bookmarks>;
  /** delete data from the table: "identities" */
  delete_identities?: Maybe<Identities_Mutation_Response>;
  /** delete single row from the table: "identities" */
  delete_identities_by_pk?: Maybe<Identities>;
  /** delete data from the table: "tags" */
  delete_tags?: Maybe<Tags_Mutation_Response>;
  /** delete single row from the table: "tags" */
  delete_tags_by_pk?: Maybe<Tags>;
  /** delete data from the table: "user_bookmarks" */
  delete_user_bookmarks?: Maybe<User_Bookmarks_Mutation_Response>;
  /** delete single row from the table: "user_bookmarks" */
  delete_user_bookmarks_by_pk?: Maybe<User_Bookmarks>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** insert data into the table: "bookmark_tags" */
  insert_bookmark_tags?: Maybe<Bookmark_Tags_Mutation_Response>;
  /** insert a single row into the table: "bookmark_tags" */
  insert_bookmark_tags_one?: Maybe<Bookmark_Tags>;
  /** insert data into the table: "bookmarks" */
  insert_bookmarks?: Maybe<Bookmarks_Mutation_Response>;
  /** insert a single row into the table: "bookmarks" */
  insert_bookmarks_one?: Maybe<Bookmarks>;
  /** insert data into the table: "identities" */
  insert_identities?: Maybe<Identities_Mutation_Response>;
  /** insert a single row into the table: "identities" */
  insert_identities_one?: Maybe<Identities>;
  /** insert data into the table: "tags" */
  insert_tags?: Maybe<Tags_Mutation_Response>;
  /** insert a single row into the table: "tags" */
  insert_tags_one?: Maybe<Tags>;
  /** insert data into the table: "user_bookmarks" */
  insert_user_bookmarks?: Maybe<User_Bookmarks_Mutation_Response>;
  /** insert a single row into the table: "user_bookmarks" */
  insert_user_bookmarks_one?: Maybe<User_Bookmarks>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  saveBookmark: SavedBookmark;
  /** update data of the table: "bookmark_tags" */
  update_bookmark_tags?: Maybe<Bookmark_Tags_Mutation_Response>;
  /** update single row of the table: "bookmark_tags" */
  update_bookmark_tags_by_pk?: Maybe<Bookmark_Tags>;
  /** update data of the table: "bookmarks" */
  update_bookmarks?: Maybe<Bookmarks_Mutation_Response>;
  /** update single row of the table: "bookmarks" */
  update_bookmarks_by_pk?: Maybe<Bookmarks>;
  /** update data of the table: "identities" */
  update_identities?: Maybe<Identities_Mutation_Response>;
  /** update single row of the table: "identities" */
  update_identities_by_pk?: Maybe<Identities>;
  /** update data of the table: "tags" */
  update_tags?: Maybe<Tags_Mutation_Response>;
  /** update single row of the table: "tags" */
  update_tags_by_pk?: Maybe<Tags>;
  /** update data of the table: "user_bookmarks" */
  update_user_bookmarks?: Maybe<User_Bookmarks_Mutation_Response>;
  /** update single row of the table: "user_bookmarks" */
  update_user_bookmarks_by_pk?: Maybe<User_Bookmarks>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
};


/** mutation root */
export type Mutation_RootDelete_Bookmark_TagsArgs = {
  where: Bookmark_Tags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bookmark_Tags_By_PkArgs = {
  bookmark_id: Scalars['uuid'];
  tag_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_BookmarksArgs = {
  where: Bookmarks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bookmarks_By_PkArgs = {
  id: Scalars['uuid'];
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
export type Mutation_RootDelete_TagsArgs = {
  where: Tags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Tags_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_User_BookmarksArgs = {
  where: User_Bookmarks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Bookmarks_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_Bookmark_TagsArgs = {
  objects: Array<Bookmark_Tags_Insert_Input>;
  on_conflict?: InputMaybe<Bookmark_Tags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bookmark_Tags_OneArgs = {
  object: Bookmark_Tags_Insert_Input;
  on_conflict?: InputMaybe<Bookmark_Tags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_BookmarksArgs = {
  objects: Array<Bookmarks_Insert_Input>;
  on_conflict?: InputMaybe<Bookmarks_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bookmarks_OneArgs = {
  object: Bookmarks_Insert_Input;
  on_conflict?: InputMaybe<Bookmarks_On_Conflict>;
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
export type Mutation_RootInsert_TagsArgs = {
  objects: Array<Tags_Insert_Input>;
  on_conflict?: InputMaybe<Tags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Tags_OneArgs = {
  object: Tags_Insert_Input;
  on_conflict?: InputMaybe<Tags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_BookmarksArgs = {
  objects: Array<User_Bookmarks_Insert_Input>;
  on_conflict?: InputMaybe<User_Bookmarks_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Bookmarks_OneArgs = {
  object: User_Bookmarks_Insert_Input;
  on_conflict?: InputMaybe<User_Bookmarks_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootSaveBookmarkArgs = {
  input: NewBookmark;
};


/** mutation root */
export type Mutation_RootUpdate_Bookmark_TagsArgs = {
  _set?: InputMaybe<Bookmark_Tags_Set_Input>;
  where: Bookmark_Tags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bookmark_Tags_By_PkArgs = {
  _set?: InputMaybe<Bookmark_Tags_Set_Input>;
  pk_columns: Bookmark_Tags_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_BookmarksArgs = {
  _set?: InputMaybe<Bookmarks_Set_Input>;
  where: Bookmarks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bookmarks_By_PkArgs = {
  _set?: InputMaybe<Bookmarks_Set_Input>;
  pk_columns: Bookmarks_Pk_Columns_Input;
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
export type Mutation_RootUpdate_TagsArgs = {
  _set?: InputMaybe<Tags_Set_Input>;
  where: Tags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Tags_By_PkArgs = {
  _set?: InputMaybe<Tags_Set_Input>;
  pk_columns: Tags_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_BookmarksArgs = {
  _set?: InputMaybe<User_Bookmarks_Set_Input>;
  where: User_Bookmarks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Bookmarks_By_PkArgs = {
  _set?: InputMaybe<User_Bookmarks_Set_Input>;
  pk_columns: User_Bookmarks_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
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

export type Query_Root = {
  __typename?: 'query_root';
  bookmarkQuery: BookmarkQueryResponse;
  /** An array relationship */
  bookmark_tags: Array<Bookmark_Tags>;
  /** An aggregate relationship */
  bookmark_tags_aggregate: Bookmark_Tags_Aggregate;
  /** fetch data from the table: "bookmark_tags" using primary key columns */
  bookmark_tags_by_pk?: Maybe<Bookmark_Tags>;
  /** fetch data from the table: "bookmarks" */
  bookmarks: Array<Bookmarks>;
  /** fetch aggregated fields from the table: "bookmarks" */
  bookmarks_aggregate: Bookmarks_Aggregate;
  /** fetch data from the table: "bookmarks" using primary key columns */
  bookmarks_by_pk?: Maybe<Bookmarks>;
  /** fetch data from the table: "identities" */
  identities: Array<Identities>;
  /** fetch aggregated fields from the table: "identities" */
  identities_aggregate: Identities_Aggregate;
  /** fetch data from the table: "identities" using primary key columns */
  identities_by_pk?: Maybe<Identities>;
  /** fetch data from the table: "tags" */
  tags: Array<Tags>;
  /** fetch aggregated fields from the table: "tags" */
  tags_aggregate: Tags_Aggregate;
  /** fetch data from the table: "tags" using primary key columns */
  tags_by_pk?: Maybe<Tags>;
  /** An array relationship */
  user_bookmarks: Array<User_Bookmarks>;
  /** An aggregate relationship */
  user_bookmarks_aggregate: User_Bookmarks_Aggregate;
  /** fetch data from the table: "user_bookmarks" using primary key columns */
  user_bookmarks_by_pk?: Maybe<User_Bookmarks>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


export type Query_RootBookmarkQueryArgs = {
  q?: InputMaybe<BookmarkQueryRequest>;
};


export type Query_RootBookmark_TagsArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Tags_Order_By>>;
  where?: InputMaybe<Bookmark_Tags_Bool_Exp>;
};


export type Query_RootBookmark_Tags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Tags_Order_By>>;
  where?: InputMaybe<Bookmark_Tags_Bool_Exp>;
};


export type Query_RootBookmark_Tags_By_PkArgs = {
  bookmark_id: Scalars['uuid'];
  tag_id: Scalars['uuid'];
};


export type Query_RootBookmarksArgs = {
  distinct_on?: InputMaybe<Array<Bookmarks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmarks_Order_By>>;
  where?: InputMaybe<Bookmarks_Bool_Exp>;
};


export type Query_RootBookmarks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bookmarks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmarks_Order_By>>;
  where?: InputMaybe<Bookmarks_Bool_Exp>;
};


export type Query_RootBookmarks_By_PkArgs = {
  id: Scalars['uuid'];
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


export type Query_RootTagsArgs = {
  distinct_on?: InputMaybe<Array<Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Order_By>>;
  where?: InputMaybe<Tags_Bool_Exp>;
};


export type Query_RootTags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Order_By>>;
  where?: InputMaybe<Tags_Bool_Exp>;
};


export type Query_RootTags_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUser_BookmarksArgs = {
  distinct_on?: InputMaybe<Array<User_Bookmarks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Bookmarks_Order_By>>;
  where?: InputMaybe<User_Bookmarks_Bool_Exp>;
};


export type Query_RootUser_Bookmarks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Bookmarks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Bookmarks_Order_By>>;
  where?: InputMaybe<User_Bookmarks_Bool_Exp>;
};


export type Query_RootUser_Bookmarks_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsers_By_PkArgs = {
  id: Scalars['uuid'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** An array relationship */
  bookmark_tags: Array<Bookmark_Tags>;
  /** An aggregate relationship */
  bookmark_tags_aggregate: Bookmark_Tags_Aggregate;
  /** fetch data from the table: "bookmark_tags" using primary key columns */
  bookmark_tags_by_pk?: Maybe<Bookmark_Tags>;
  /** fetch data from the table: "bookmarks" */
  bookmarks: Array<Bookmarks>;
  /** fetch aggregated fields from the table: "bookmarks" */
  bookmarks_aggregate: Bookmarks_Aggregate;
  /** fetch data from the table: "bookmarks" using primary key columns */
  bookmarks_by_pk?: Maybe<Bookmarks>;
  /** fetch data from the table: "identities" */
  identities: Array<Identities>;
  /** fetch aggregated fields from the table: "identities" */
  identities_aggregate: Identities_Aggregate;
  /** fetch data from the table: "identities" using primary key columns */
  identities_by_pk?: Maybe<Identities>;
  /** fetch data from the table: "tags" */
  tags: Array<Tags>;
  /** fetch aggregated fields from the table: "tags" */
  tags_aggregate: Tags_Aggregate;
  /** fetch data from the table: "tags" using primary key columns */
  tags_by_pk?: Maybe<Tags>;
  /** An array relationship */
  user_bookmarks: Array<User_Bookmarks>;
  /** An aggregate relationship */
  user_bookmarks_aggregate: User_Bookmarks_Aggregate;
  /** fetch data from the table: "user_bookmarks" using primary key columns */
  user_bookmarks_by_pk?: Maybe<User_Bookmarks>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


export type Subscription_RootBookmark_TagsArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Tags_Order_By>>;
  where?: InputMaybe<Bookmark_Tags_Bool_Exp>;
};


export type Subscription_RootBookmark_Tags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bookmark_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmark_Tags_Order_By>>;
  where?: InputMaybe<Bookmark_Tags_Bool_Exp>;
};


export type Subscription_RootBookmark_Tags_By_PkArgs = {
  bookmark_id: Scalars['uuid'];
  tag_id: Scalars['uuid'];
};


export type Subscription_RootBookmarksArgs = {
  distinct_on?: InputMaybe<Array<Bookmarks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmarks_Order_By>>;
  where?: InputMaybe<Bookmarks_Bool_Exp>;
};


export type Subscription_RootBookmarks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bookmarks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmarks_Order_By>>;
  where?: InputMaybe<Bookmarks_Bool_Exp>;
};


export type Subscription_RootBookmarks_By_PkArgs = {
  id: Scalars['uuid'];
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


export type Subscription_RootTagsArgs = {
  distinct_on?: InputMaybe<Array<Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Order_By>>;
  where?: InputMaybe<Tags_Bool_Exp>;
};


export type Subscription_RootTags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Tags_Order_By>>;
  where?: InputMaybe<Tags_Bool_Exp>;
};


export type Subscription_RootTags_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUser_BookmarksArgs = {
  distinct_on?: InputMaybe<Array<User_Bookmarks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Bookmarks_Order_By>>;
  where?: InputMaybe<User_Bookmarks_Bool_Exp>;
};


export type Subscription_RootUser_Bookmarks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Bookmarks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Bookmarks_Order_By>>;
  where?: InputMaybe<User_Bookmarks_Bool_Exp>;
};


export type Subscription_RootUser_Bookmarks_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars['uuid'];
};

/** columns and relationships of "tags" */
export type Tags = {
  __typename?: 'tags';
  id: Scalars['uuid'];
  name: Scalars['String'];
};

/** aggregated selection of "tags" */
export type Tags_Aggregate = {
  __typename?: 'tags_aggregate';
  aggregate?: Maybe<Tags_Aggregate_Fields>;
  nodes: Array<Tags>;
};

/** aggregate fields of "tags" */
export type Tags_Aggregate_Fields = {
  __typename?: 'tags_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Tags_Max_Fields>;
  min?: Maybe<Tags_Min_Fields>;
};


/** aggregate fields of "tags" */
export type Tags_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Tags_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "tags". All fields are combined with a logical 'AND'. */
export type Tags_Bool_Exp = {
  _and?: InputMaybe<Array<Tags_Bool_Exp>>;
  _not?: InputMaybe<Tags_Bool_Exp>;
  _or?: InputMaybe<Array<Tags_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "tags" */
export enum Tags_Constraint {
  /** unique or primary key constraint */
  TagNameUnique = 'tag_name_unique',
  /** unique or primary key constraint */
  TagsPkey = 'tags_pkey'
}

/** input type for inserting data into table "tags" */
export type Tags_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Tags_Max_Fields = {
  __typename?: 'tags_max_fields';
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Tags_Min_Fields = {
  __typename?: 'tags_min_fields';
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "tags" */
export type Tags_Mutation_Response = {
  __typename?: 'tags_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Tags>;
};

/** on_conflict condition type for table "tags" */
export type Tags_On_Conflict = {
  constraint: Tags_Constraint;
  update_columns?: Array<Tags_Update_Column>;
  where?: InputMaybe<Tags_Bool_Exp>;
};

/** Ordering options when selecting data from "tags". */
export type Tags_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: tags */
export type Tags_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "tags" */
export enum Tags_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "tags" */
export type Tags_Set_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "tags" */
export enum Tags_Update_Column {
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

/** Bookmarks for a user */
export type User_Bookmarks = {
  __typename?: 'user_bookmarks';
  /** An object relationship */
  bookmark: Bookmarks;
  bookmark_id: Scalars['uuid'];
  id: Scalars['uuid'];
  name?: Maybe<Scalars['String']>;
  /** An object relationship */
  user: Users;
  user_id: Scalars['uuid'];
};

/** aggregated selection of "user_bookmarks" */
export type User_Bookmarks_Aggregate = {
  __typename?: 'user_bookmarks_aggregate';
  aggregate?: Maybe<User_Bookmarks_Aggregate_Fields>;
  nodes: Array<User_Bookmarks>;
};

/** aggregate fields of "user_bookmarks" */
export type User_Bookmarks_Aggregate_Fields = {
  __typename?: 'user_bookmarks_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<User_Bookmarks_Max_Fields>;
  min?: Maybe<User_Bookmarks_Min_Fields>;
};


/** aggregate fields of "user_bookmarks" */
export type User_Bookmarks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Bookmarks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "user_bookmarks" */
export type User_Bookmarks_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<User_Bookmarks_Max_Order_By>;
  min?: InputMaybe<User_Bookmarks_Min_Order_By>;
};

/** input type for inserting array relation for remote table "user_bookmarks" */
export type User_Bookmarks_Arr_Rel_Insert_Input = {
  data: Array<User_Bookmarks_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<User_Bookmarks_On_Conflict>;
};

/** Boolean expression to filter rows from the table "user_bookmarks". All fields are combined with a logical 'AND'. */
export type User_Bookmarks_Bool_Exp = {
  _and?: InputMaybe<Array<User_Bookmarks_Bool_Exp>>;
  _not?: InputMaybe<User_Bookmarks_Bool_Exp>;
  _or?: InputMaybe<Array<User_Bookmarks_Bool_Exp>>;
  bookmark?: InputMaybe<Bookmarks_Bool_Exp>;
  bookmark_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_bookmarks" */
export enum User_Bookmarks_Constraint {
  /** unique or primary key constraint */
  UserBookmarksPkey = 'user_bookmarks_pkey'
}

/** input type for inserting data into table "user_bookmarks" */
export type User_Bookmarks_Insert_Input = {
  bookmark?: InputMaybe<Bookmarks_Obj_Rel_Insert_Input>;
  bookmark_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type User_Bookmarks_Max_Fields = {
  __typename?: 'user_bookmarks_max_fields';
  bookmark_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "user_bookmarks" */
export type User_Bookmarks_Max_Order_By = {
  bookmark_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type User_Bookmarks_Min_Fields = {
  __typename?: 'user_bookmarks_min_fields';
  bookmark_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "user_bookmarks" */
export type User_Bookmarks_Min_Order_By = {
  bookmark_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "user_bookmarks" */
export type User_Bookmarks_Mutation_Response = {
  __typename?: 'user_bookmarks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Bookmarks>;
};

/** on_conflict condition type for table "user_bookmarks" */
export type User_Bookmarks_On_Conflict = {
  constraint: User_Bookmarks_Constraint;
  update_columns?: Array<User_Bookmarks_Update_Column>;
  where?: InputMaybe<User_Bookmarks_Bool_Exp>;
};

/** Ordering options when selecting data from "user_bookmarks". */
export type User_Bookmarks_Order_By = {
  bookmark?: InputMaybe<Bookmarks_Order_By>;
  bookmark_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user_bookmarks */
export type User_Bookmarks_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "user_bookmarks" */
export enum User_Bookmarks_Select_Column {
  /** column name */
  BookmarkId = 'bookmark_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "user_bookmarks" */
export type User_Bookmarks_Set_Input = {
  bookmark_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "user_bookmarks" */
export enum User_Bookmarks_Update_Column {
  /** column name */
  BookmarkId = 'bookmark_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UserId = 'user_id'
}

/** Users for Sifty */
export type Users = {
  __typename?: 'users';
  id: Scalars['uuid'];
  /** An object relationship */
  identity: Identities;
  kratos_id: Scalars['uuid'];
  /** An array relationship */
  user_bookmarks: Array<User_Bookmarks>;
  /** An aggregate relationship */
  user_bookmarks_aggregate: User_Bookmarks_Aggregate;
};


/** Users for Sifty */
export type UsersUser_BookmarksArgs = {
  distinct_on?: InputMaybe<Array<User_Bookmarks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Bookmarks_Order_By>>;
  where?: InputMaybe<User_Bookmarks_Bool_Exp>;
};


/** Users for Sifty */
export type UsersUser_Bookmarks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Bookmarks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Bookmarks_Order_By>>;
  where?: InputMaybe<User_Bookmarks_Bool_Exp>;
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename?: 'users_aggregate';
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename?: 'users_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
};


/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  identity?: InputMaybe<Identities_Bool_Exp>;
  kratos_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_bookmarks?: InputMaybe<User_Bookmarks_Bool_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint */
  UsersPkey = 'users_pkey'
}

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  identity?: InputMaybe<Identities_Obj_Rel_Insert_Input>;
  kratos_id?: InputMaybe<Scalars['uuid']>;
  user_bookmarks?: InputMaybe<User_Bookmarks_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  id?: Maybe<Scalars['uuid']>;
  kratos_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  id?: Maybe<Scalars['uuid']>;
  kratos_id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: 'users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** on_conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  id?: InputMaybe<Order_By>;
  identity?: InputMaybe<Identities_Order_By>;
  kratos_id?: InputMaybe<Order_By>;
  user_bookmarks_aggregate?: InputMaybe<User_Bookmarks_Aggregate_Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  KratosId = 'kratos_id'
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  kratos_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
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


export type GetBookmarkQuery = { __typename?: 'query_root', bookmarks_by_pk?: { __typename?: 'bookmarks', url: string, title: string, public: boolean, modified: any, id: any, html: string, excerpt: string, content: string, author: string } | null };

export type GetBookmarksQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type GetBookmarksQuery = { __typename?: 'query_root', bookmarks: Array<{ __typename?: 'bookmarks', id: any, title: string, url: string, public: boolean, excerpt: string, modified: any, author: string }> };

export type SaveBookmarkByUrlMutationVariables = Exact<{
  url: Scalars['String'];
}>;


export type SaveBookmarkByUrlMutation = { __typename?: 'mutation_root', saveBookmark: { __typename?: 'SavedBookmark', title: string } };


export const GetBookmarkDocument = gql`
    query GetBookmark($id: uuid!) {
  bookmarks_by_pk(id: $id) {
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
  bookmarks(limit: $limit) {
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