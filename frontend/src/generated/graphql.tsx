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
  smallint: any;
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
  content: Scalars['String'];
  excerpt: Scalars['String'];
  html: Scalars['String'];
  id: Scalars['uuid'];
  modified: Scalars['timestamp'];
  public: Scalars['smallint'];
  title: Scalars['String'];
  url: Scalars['String'];
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
  avg?: Maybe<Bookmark_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Bookmark_Max_Fields>;
  min?: Maybe<Bookmark_Min_Fields>;
  stddev?: Maybe<Bookmark_Stddev_Fields>;
  stddev_pop?: Maybe<Bookmark_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Bookmark_Stddev_Samp_Fields>;
  sum?: Maybe<Bookmark_Sum_Fields>;
  var_pop?: Maybe<Bookmark_Var_Pop_Fields>;
  var_samp?: Maybe<Bookmark_Var_Samp_Fields>;
  variance?: Maybe<Bookmark_Variance_Fields>;
};


/** aggregate fields of "bookmark" */
export type Bookmark_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bookmark_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Bookmark_Avg_Fields = {
  __typename?: 'bookmark_avg_fields';
  public?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "bookmark". All fields are combined with a logical 'AND'. */
export type Bookmark_Bool_Exp = {
  _and?: InputMaybe<Array<Bookmark_Bool_Exp>>;
  _not?: InputMaybe<Bookmark_Bool_Exp>;
  _or?: InputMaybe<Array<Bookmark_Bool_Exp>>;
  author?: InputMaybe<String_Comparison_Exp>;
  content?: InputMaybe<String_Comparison_Exp>;
  excerpt?: InputMaybe<String_Comparison_Exp>;
  html?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  modified?: InputMaybe<Timestamp_Comparison_Exp>;
  public?: InputMaybe<Smallint_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "bookmark" */
export enum Bookmark_Constraint {
  /** unique or primary key constraint */
  BookmarkPkey = 'bookmark_pkey',
  /** unique or primary key constraint */
  BookmarkUrlUnique = 'bookmark_url_unique'
}

/** input type for incrementing numeric columns in table "bookmark" */
export type Bookmark_Inc_Input = {
  public?: InputMaybe<Scalars['smallint']>;
};

/** input type for inserting data into table "bookmark" */
export type Bookmark_Insert_Input = {
  author?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  excerpt?: InputMaybe<Scalars['String']>;
  html?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  modified?: InputMaybe<Scalars['timestamp']>;
  public?: InputMaybe<Scalars['smallint']>;
  title?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
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
  public?: Maybe<Scalars['smallint']>;
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
  public?: Maybe<Scalars['smallint']>;
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

/** on_conflict condition type for table "bookmark" */
export type Bookmark_On_Conflict = {
  constraint: Bookmark_Constraint;
  update_columns?: Array<Bookmark_Update_Column>;
  where?: InputMaybe<Bookmark_Bool_Exp>;
};

/** Ordering options when selecting data from "bookmark". */
export type Bookmark_Order_By = {
  author?: InputMaybe<Order_By>;
  content?: InputMaybe<Order_By>;
  excerpt?: InputMaybe<Order_By>;
  html?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  modified?: InputMaybe<Order_By>;
  public?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
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
  public?: InputMaybe<Scalars['smallint']>;
  title?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Bookmark_Stddev_Fields = {
  __typename?: 'bookmark_stddev_fields';
  public?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Bookmark_Stddev_Pop_Fields = {
  __typename?: 'bookmark_stddev_pop_fields';
  public?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Bookmark_Stddev_Samp_Fields = {
  __typename?: 'bookmark_stddev_samp_fields';
  public?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Bookmark_Sum_Fields = {
  __typename?: 'bookmark_sum_fields';
  public?: Maybe<Scalars['smallint']>;
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

/** aggregate min on columns */
export type Bookmark_Tag_Min_Fields = {
  __typename?: 'bookmark_tag_min_fields';
  bookmark_id?: Maybe<Scalars['uuid']>;
  tag_id?: Maybe<Scalars['uuid']>;
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

/** aggregate var_pop on columns */
export type Bookmark_Var_Pop_Fields = {
  __typename?: 'bookmark_var_pop_fields';
  public?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Bookmark_Var_Samp_Fields = {
  __typename?: 'bookmark_var_samp_fields';
  public?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Bookmark_Variance_Fields = {
  __typename?: 'bookmark_variance_fields';
  public?: Maybe<Scalars['Float']>;
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
  /** delete data from the table: "tag" */
  delete_tag?: Maybe<Tag_Mutation_Response>;
  /** delete single row from the table: "tag" */
  delete_tag_by_pk?: Maybe<Tag>;
  /** insert data into the table: "bookmark" */
  insert_bookmark?: Maybe<Bookmark_Mutation_Response>;
  /** insert a single row into the table: "bookmark" */
  insert_bookmark_one?: Maybe<Bookmark>;
  /** insert data into the table: "bookmark_tag" */
  insert_bookmark_tag?: Maybe<Bookmark_Tag_Mutation_Response>;
  /** insert a single row into the table: "bookmark_tag" */
  insert_bookmark_tag_one?: Maybe<Bookmark_Tag>;
  /** insert data into the table: "tag" */
  insert_tag?: Maybe<Tag_Mutation_Response>;
  /** insert a single row into the table: "tag" */
  insert_tag_one?: Maybe<Tag>;
  saveBookmark: SavedBookmark;
  /** update data of the table: "bookmark" */
  update_bookmark?: Maybe<Bookmark_Mutation_Response>;
  /** update single row of the table: "bookmark" */
  update_bookmark_by_pk?: Maybe<Bookmark>;
  /** update data of the table: "bookmark_tag" */
  update_bookmark_tag?: Maybe<Bookmark_Tag_Mutation_Response>;
  /** update single row of the table: "bookmark_tag" */
  update_bookmark_tag_by_pk?: Maybe<Bookmark_Tag>;
  /** update data of the table: "tag" */
  update_tag?: Maybe<Tag_Mutation_Response>;
  /** update single row of the table: "tag" */
  update_tag_by_pk?: Maybe<Tag>;
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
export type Mutation_RootDelete_TagArgs = {
  where: Tag_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Tag_By_PkArgs = {
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
export type Mutation_RootSaveBookmarkArgs = {
  input: NewBookmark;
};


/** mutation root */
export type Mutation_RootUpdate_BookmarkArgs = {
  _inc?: InputMaybe<Bookmark_Inc_Input>;
  _set?: InputMaybe<Bookmark_Set_Input>;
  where: Bookmark_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bookmark_By_PkArgs = {
  _inc?: InputMaybe<Bookmark_Inc_Input>;
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
export type Mutation_RootUpdate_TagArgs = {
  _set?: InputMaybe<Tag_Set_Input>;
  where: Tag_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Tag_By_PkArgs = {
  _set?: InputMaybe<Tag_Set_Input>;
  pk_columns: Tag_Pk_Columns_Input;
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
  /** fetch data from the table: "tag" */
  tag: Array<Tag>;
  /** fetch aggregated fields from the table: "tag" */
  tag_aggregate: Tag_Aggregate;
  /** fetch data from the table: "tag" using primary key columns */
  tag_by_pk?: Maybe<Tag>;
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

/** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
export type Smallint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['smallint']>;
  _gt?: InputMaybe<Scalars['smallint']>;
  _gte?: InputMaybe<Scalars['smallint']>;
  _in?: InputMaybe<Array<Scalars['smallint']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['smallint']>;
  _lte?: InputMaybe<Scalars['smallint']>;
  _neq?: InputMaybe<Scalars['smallint']>;
  _nin?: InputMaybe<Array<Scalars['smallint']>>;
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
  /** fetch data from the table: "tag" */
  tag: Array<Tag>;
  /** fetch aggregated fields from the table: "tag" */
  tag_aggregate: Tag_Aggregate;
  /** fetch data from the table: "tag" using primary key columns */
  tag_by_pk?: Maybe<Tag>;
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

export type GetBookmarksQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type GetBookmarksQuery = { __typename?: 'query_root', bookmark: Array<{ __typename?: 'bookmark', id: any, title: string, url: string, public: any, modified: any, author: string }> };

export type SaveBookmarkByUrlMutationVariables = Exact<{
  url: Scalars['String'];
}>;


export type SaveBookmarkByUrlMutation = { __typename?: 'mutation_root', saveBookmark: { __typename?: 'SavedBookmark', title: string } };


export const GetBookmarksDocument = gql`
    query GetBookmarks($limit: Int = 10) {
  bookmark(limit: $limit) {
    id
    title
    url
    public
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