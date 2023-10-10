// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file content/content.proto (package content, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";

/**
 * @generated from message content.ContentIDs
 */
export class ContentIDs extends Message<ContentIDs> {
  /**
   * @generated from field: repeated string content_ids = 1;
   */
  contentIds: string[] = [];

  constructor(data?: PartialMessage<ContentIDs>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.ContentIDs";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "content_ids", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ContentIDs {
    return new ContentIDs().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ContentIDs {
    return new ContentIDs().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ContentIDs {
    return new ContentIDs().fromJsonString(jsonString, options);
  }

  static equals(a: ContentIDs | PlainMessage<ContentIDs> | undefined, b: ContentIDs | PlainMessage<ContentIDs> | undefined): boolean {
    return proto3.util.equals(ContentIDs, a, b);
  }
}

/**
 * @generated from message content.Contents
 */
export class Contents extends Message<Contents> {
  /**
   * @generated from field: content.Content content = 1;
   */
  content?: Content;

  /**
   * @generated from field: repeated content.Content related = 2;
   */
  related: Content[] = [];

  constructor(data?: PartialMessage<Contents>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Contents";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "content", kind: "message", T: Content },
    { no: 2, name: "related", kind: "message", T: Content, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Contents {
    return new Contents().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Contents {
    return new Contents().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Contents {
    return new Contents().fromJsonString(jsonString, options);
  }

  static equals(a: Contents | PlainMessage<Contents> | undefined, b: Contents | PlainMessage<Contents> | undefined): boolean {
    return proto3.util.equals(Contents, a, b);
  }
}

/**
 * @generated from message content.Query
 */
export class Query extends Message<Query> {
  /**
   * @generated from field: string query = 1;
   */
  query = "";

  /**
   * @generated from field: uint32 page = 2;
   */
  page = 0;

  /**
   * @generated from field: string contentID = 3;
   */
  contentID = "";

  constructor(data?: PartialMessage<Query>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Query";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "query", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "page", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 3, name: "contentID", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Query {
    return new Query().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Query {
    return new Query().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Query {
    return new Query().fromJsonString(jsonString, options);
  }

  static equals(a: Query | PlainMessage<Query> | undefined, b: Query | PlainMessage<Query> | undefined): boolean {
    return proto3.util.equals(Query, a, b);
  }
}

/**
 * @generated from message content.Results
 */
export class Results extends Message<Results> {
  /**
   * @generated from field: repeated content.StoredContent storedContent = 1;
   */
  storedContent: StoredContent[] = [];

  constructor(data?: PartialMessage<Results>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Results";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "storedContent", kind: "message", T: StoredContent, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Results {
    return new Results().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Results {
    return new Results().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Results {
    return new Results().fromJsonString(jsonString, options);
  }

  static equals(a: Results | PlainMessage<Results> | undefined, b: Results | PlainMessage<Results> | undefined): boolean {
    return proto3.util.equals(Results, a, b);
  }
}

/**
 * @generated from message content.StoredContent
 */
export class StoredContent extends Message<StoredContent> {
  /**
   * @generated from field: content.Content content = 1;
   */
  content?: Content;

  /**
   * @generated from field: string id = 2;
   */
  id = "";

  /**
   * @generated from field: repeated content.Content related = 3;
   */
  related: Content[] = [];

  /**
   * @generated from field: string title = 4;
   */
  title = "";

  /**
   * @generated from field: string description = 5;
   */
  description = "";

  /**
   * @generated from field: string image = 6;
   */
  image = "";

  constructor(data?: PartialMessage<StoredContent>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.StoredContent";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "content", kind: "message", T: Content },
    { no: 2, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "related", kind: "message", T: Content, repeated: true },
    { no: 4, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "image", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): StoredContent {
    return new StoredContent().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): StoredContent {
    return new StoredContent().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): StoredContent {
    return new StoredContent().fromJsonString(jsonString, options);
  }

  static equals(a: StoredContent | PlainMessage<StoredContent> | undefined, b: StoredContent | PlainMessage<StoredContent> | undefined): boolean {
    return proto3.util.equals(StoredContent, a, b);
  }
}

/**
 * @generated from message content.Edge
 */
export class Edge extends Message<Edge> {
  /**
   * @generated from field: string from = 1;
   */
  from = "";

  /**
   * @generated from field: string to = 2;
   */
  to = "";

  constructor(data?: PartialMessage<Edge>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Edge";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "from", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "to", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Edge {
    return new Edge().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Edge {
    return new Edge().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Edge {
    return new Edge().fromJsonString(jsonString, options);
  }

  static equals(a: Edge | PlainMessage<Edge> | undefined, b: Edge | PlainMessage<Edge> | undefined): boolean {
    return proto3.util.equals(Edge, a, b);
  }
}

/**
 * Content has data and metadata
 *
 * @generated from message content.Content
 */
export class Content extends Message<Content> {
  /**
   * @generated from field: repeated string tags = 1;
   */
  tags: string[] = [];

  /**
   * @generated from field: string created_at = 2;
   */
  createdAt = "";

  /**
   * @generated from oneof content.Content.type
   */
  type: {
    /**
     * @generated from field: content.Data data = 6;
     */
    value: Data;
    case: "data";
  } | {
    /**
     * @generated from field: content.Normalized normalized = 7;
     */
    value: Normalized;
    case: "normalized";
  } | {
    /**
     * @generated from field: content.Transformed transformed = 8;
     */
    value: Transformed;
    case: "transformed";
  } | {
    /**
     * @generated from field: content.Source source = 9;
     */
    value: Source;
    case: "source";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<Content>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Content";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "tags", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 2, name: "created_at", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "data", kind: "message", T: Data, oneof: "type" },
    { no: 7, name: "normalized", kind: "message", T: Normalized, oneof: "type" },
    { no: 8, name: "transformed", kind: "message", T: Transformed, oneof: "type" },
    { no: 9, name: "source", kind: "message", T: Source, oneof: "type" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Content {
    return new Content().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Content {
    return new Content().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Content {
    return new Content().fromJsonString(jsonString, options);
  }

  static equals(a: Content | PlainMessage<Content> | undefined, b: Content | PlainMessage<Content> | undefined): boolean {
    return proto3.util.equals(Content, a, b);
  }
}

/**
 * @generated from message content.Source
 */
export class Source extends Message<Source> {
  /**
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * @generated from oneof content.Source.type
   */
  type: {
    /**
     * @generated from field: content.YouTubeChannel youtube_channel = 4;
     */
    value: YouTubeChannel;
    case: "youtubeChannel";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<Source>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Source";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "youtube_channel", kind: "message", T: YouTubeChannel, oneof: "type" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Source {
    return new Source().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Source {
    return new Source().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Source {
    return new Source().fromJsonString(jsonString, options);
  }

  static equals(a: Source | PlainMessage<Source> | undefined, b: Source | PlainMessage<Source> | undefined): boolean {
    return proto3.util.equals(Source, a, b);
  }
}

/**
 * @generated from message content.YouTubeChannel
 */
export class YouTubeChannel extends Message<YouTubeChannel> {
  /**
   * @generated from field: string channel_id = 1;
   */
  channelId = "";

  constructor(data?: PartialMessage<YouTubeChannel>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.YouTubeChannel";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "channel_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): YouTubeChannel {
    return new YouTubeChannel().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): YouTubeChannel {
    return new YouTubeChannel().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): YouTubeChannel {
    return new YouTubeChannel().fromJsonString(jsonString, options);
  }

  static equals(a: YouTubeChannel | PlainMessage<YouTubeChannel> | undefined, b: YouTubeChannel | PlainMessage<YouTubeChannel> | undefined): boolean {
    return proto3.util.equals(YouTubeChannel, a, b);
  }
}

/**
 * @generated from message content.Group
 */
export class Group extends Message<Group> {
  /**
   * @generated from field: string name = 1;
   */
  name = "";

  constructor(data?: PartialMessage<Group>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Group";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Group {
    return new Group().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Group {
    return new Group().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Group {
    return new Group().fromJsonString(jsonString, options);
  }

  static equals(a: Group | PlainMessage<Group> | undefined, b: Group | PlainMessage<Group> | undefined): boolean {
    return proto3.util.equals(Group, a, b);
  }
}

/**
 * @generated from message content.Data
 */
export class Data extends Message<Data> {
  /**
   * @generated from oneof content.Data.type
   */
  type: {
    /**
     * @generated from field: content.Text text = 4;
     */
    value: Text;
    case: "text";
  } | {
    /**
     * @generated from field: content.File file = 5;
     */
    value: File;
    case: "file";
  } | {
    /**
     * @generated from field: content.URL url = 6;
     */
    value: URL;
    case: "url";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<Data>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Data";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 4, name: "text", kind: "message", T: Text, oneof: "type" },
    { no: 5, name: "file", kind: "message", T: File, oneof: "type" },
    { no: 6, name: "url", kind: "message", T: URL, oneof: "type" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Data {
    return new Data().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Data {
    return new Data().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Data {
    return new Data().fromJsonString(jsonString, options);
  }

  static equals(a: Data | PlainMessage<Data> | undefined, b: Data | PlainMessage<Data> | undefined): boolean {
    return proto3.util.equals(Data, a, b);
  }
}

/**
 * @generated from message content.Normalized
 */
export class Normalized extends Message<Normalized> {
  /**
   * @generated from oneof content.Normalized.type
   */
  type: {
    /**
     * @generated from field: content.Article article = 3;
     */
    value: Article;
    case: "article";
  } | {
    /**
     * @generated from field: content.HTML html = 4;
     */
    value: HTML;
    case: "html";
  } | {
    /**
     * @generated from field: content.Transcript transcript = 6;
     */
    value: Transcript;
    case: "transcript";
  } | {
    /**
     * @generated from field: content.GitHubReadme github_readme = 7;
     */
    value: GitHubReadme;
    case: "githubReadme";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<Normalized>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Normalized";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 3, name: "article", kind: "message", T: Article, oneof: "type" },
    { no: 4, name: "html", kind: "message", T: HTML, oneof: "type" },
    { no: 6, name: "transcript", kind: "message", T: Transcript, oneof: "type" },
    { no: 7, name: "github_readme", kind: "message", T: GitHubReadme, oneof: "type" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Normalized {
    return new Normalized().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Normalized {
    return new Normalized().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Normalized {
    return new Normalized().fromJsonString(jsonString, options);
  }

  static equals(a: Normalized | PlainMessage<Normalized> | undefined, b: Normalized | PlainMessage<Normalized> | undefined): boolean {
    return proto3.util.equals(Normalized, a, b);
  }
}

/**
 * @generated from message content.Transformed
 */
export class Transformed extends Message<Transformed> {
  /**
   * @generated from oneof content.Transformed.type
   */
  type: {
    /**
     * @generated from field: content.Summary summary = 1;
     */
    value: Summary;
    case: "summary";
  } | {
    /**
     * @generated from field: content.Categories categories = 2;
     */
    value: Categories;
    case: "categories";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<Transformed>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Transformed";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "summary", kind: "message", T: Summary, oneof: "type" },
    { no: 2, name: "categories", kind: "message", T: Categories, oneof: "type" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Transformed {
    return new Transformed().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Transformed {
    return new Transformed().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Transformed {
    return new Transformed().fromJsonString(jsonString, options);
  }

  static equals(a: Transformed | PlainMessage<Transformed> | undefined, b: Transformed | PlainMessage<Transformed> | undefined): boolean {
    return proto3.util.equals(Transformed, a, b);
  }
}

/**
 * @generated from message content.Article
 */
export class Article extends Message<Article> {
  /**
   * @generated from field: string title = 1;
   */
  title = "";

  /**
   * @generated from field: string author = 2;
   */
  author = "";

  /**
   * @generated from field: int32 length = 3;
   */
  length = 0;

  /**
   * @generated from field: string excerpt = 4;
   */
  excerpt = "";

  /**
   * @generated from field: string site_name = 5;
   */
  siteName = "";

  /**
   * @generated from field: string image = 6;
   */
  image = "";

  /**
   * @generated from field: string favicon = 7;
   */
  favicon = "";

  /**
   * @generated from field: string text = 8;
   */
  text = "";

  constructor(data?: PartialMessage<Article>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Article";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "author", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "length", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 4, name: "excerpt", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "site_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "image", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "favicon", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 8, name: "text", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Article {
    return new Article().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Article {
    return new Article().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Article {
    return new Article().fromJsonString(jsonString, options);
  }

  static equals(a: Article | PlainMessage<Article> | undefined, b: Article | PlainMessage<Article> | undefined): boolean {
    return proto3.util.equals(Article, a, b);
  }
}

/**
 * @generated from message content.HTML
 */
export class HTML extends Message<HTML> {
  /**
   * @generated from field: string html = 1;
   */
  html = "";

  constructor(data?: PartialMessage<HTML>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.HTML";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "html", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): HTML {
    return new HTML().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): HTML {
    return new HTML().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): HTML {
    return new HTML().fromJsonString(jsonString, options);
  }

  static equals(a: HTML | PlainMessage<HTML> | undefined, b: HTML | PlainMessage<HTML> | undefined): boolean {
    return proto3.util.equals(HTML, a, b);
  }
}

/**
 * @generated from message content.GitHubReadme
 */
export class GitHubReadme extends Message<GitHubReadme> {
  /**
   * @generated from field: string data = 1;
   */
  data = "";

  constructor(data?: PartialMessage<GitHubReadme>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.GitHubReadme";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "data", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GitHubReadme {
    return new GitHubReadme().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GitHubReadme {
    return new GitHubReadme().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GitHubReadme {
    return new GitHubReadme().fromJsonString(jsonString, options);
  }

  static equals(a: GitHubReadme | PlainMessage<GitHubReadme> | undefined, b: GitHubReadme | PlainMessage<GitHubReadme> | undefined): boolean {
    return proto3.util.equals(GitHubReadme, a, b);
  }
}

/**
 * @generated from message content.Summary
 */
export class Summary extends Message<Summary> {
  /**
   * @generated from field: string summary = 1;
   */
  summary = "";

  constructor(data?: PartialMessage<Summary>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Summary";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Summary {
    return new Summary().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Summary {
    return new Summary().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Summary {
    return new Summary().fromJsonString(jsonString, options);
  }

  static equals(a: Summary | PlainMessage<Summary> | undefined, b: Summary | PlainMessage<Summary> | undefined): boolean {
    return proto3.util.equals(Summary, a, b);
  }
}

/**
 * @generated from message content.Categories
 */
export class Categories extends Message<Categories> {
  /**
   * @generated from field: repeated string categories = 1;
   */
  categories: string[] = [];

  constructor(data?: PartialMessage<Categories>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Categories";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "categories", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Categories {
    return new Categories().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Categories {
    return new Categories().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Categories {
    return new Categories().fromJsonString(jsonString, options);
  }

  static equals(a: Categories | PlainMessage<Categories> | undefined, b: Categories | PlainMessage<Categories> | undefined): boolean {
    return proto3.util.equals(Categories, a, b);
  }
}

/**
 * @generated from message content.File
 */
export class File extends Message<File> {
  /**
   * @generated from field: string file = 1;
   */
  file = "";

  /**
   * @generated from field: bytes data = 2;
   */
  data = new Uint8Array(0);

  constructor(data?: PartialMessage<File>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.File";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "file", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "data", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): File {
    return new File().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): File {
    return new File().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): File {
    return new File().fromJsonString(jsonString, options);
  }

  static equals(a: File | PlainMessage<File> | undefined, b: File | PlainMessage<File> | undefined): boolean {
    return proto3.util.equals(File, a, b);
  }
}

/**
 * @generated from message content.Text
 */
export class Text extends Message<Text> {
  /**
   * @generated from field: string data = 1;
   */
  data = "";

  constructor(data?: PartialMessage<Text>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Text";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "data", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Text {
    return new Text().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Text {
    return new Text().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Text {
    return new Text().fromJsonString(jsonString, options);
  }

  static equals(a: Text | PlainMessage<Text> | undefined, b: Text | PlainMessage<Text> | undefined): boolean {
    return proto3.util.equals(Text, a, b);
  }
}

/**
 * @generated from message content.URL
 */
export class URL extends Message<URL> {
  /**
   * @generated from field: string url = 1;
   */
  url = "";

  /**
   * @generated from field: bool crawl = 2;
   */
  crawl = false;

  /**
   * @generated from field: string title = 3;
   */
  title = "";

  constructor(data?: PartialMessage<URL>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.URL";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "crawl", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 3, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): URL {
    return new URL().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): URL {
    return new URL().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): URL {
    return new URL().fromJsonString(jsonString, options);
  }

  static equals(a: URL | PlainMessage<URL> | undefined, b: URL | PlainMessage<URL> | undefined): boolean {
    return proto3.util.equals(URL, a, b);
  }
}

/**
 * @generated from message content.Token
 */
export class Token extends Message<Token> {
  /**
   * @generated from field: uint32 id = 1;
   */
  id = 0;

  /**
   * @generated from field: uint64 start_time = 2;
   */
  startTime = protoInt64.zero;

  /**
   * @generated from field: uint64 end_time = 3;
   */
  endTime = protoInt64.zero;

  /**
   * @generated from field: string text = 4;
   */
  text = "";

  /**
   * @generated from field: string p = 5;
   */
  p = "";

  constructor(data?: PartialMessage<Token>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Token";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 2, name: "start_time", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "end_time", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 4, name: "text", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "p", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Token {
    return new Token().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Token {
    return new Token().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Token {
    return new Token().fromJsonString(jsonString, options);
  }

  static equals(a: Token | PlainMessage<Token> | undefined, b: Token | PlainMessage<Token> | undefined): boolean {
    return proto3.util.equals(Token, a, b);
  }
}

/**
 * @generated from message content.Segment
 */
export class Segment extends Message<Segment> {
  /**
   * @generated from field: uint32 num = 1;
   */
  num = 0;

  /**
   * @generated from field: repeated content.Token tokens = 2;
   */
  tokens: Token[] = [];

  /**
   * @generated from field: string text = 3;
   */
  text = "";

  /**
   * @generated from field: uint64 start_time = 4;
   */
  startTime = protoInt64.zero;

  /**
   * @generated from field: uint64 end_time = 5;
   */
  endTime = protoInt64.zero;

  constructor(data?: PartialMessage<Segment>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Segment";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "num", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 2, name: "tokens", kind: "message", T: Token, repeated: true },
    { no: 3, name: "text", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "start_time", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 5, name: "end_time", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Segment {
    return new Segment().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Segment {
    return new Segment().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Segment {
    return new Segment().fromJsonString(jsonString, options);
  }

  static equals(a: Segment | PlainMessage<Segment> | undefined, b: Segment | PlainMessage<Segment> | undefined): boolean {
    return proto3.util.equals(Segment, a, b);
  }
}

/**
 * @generated from message content.Transcript
 */
export class Transcript extends Message<Transcript> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * @generated from field: string name = 2;
   */
  name = "";

  /**
   * @generated from field: repeated content.Segment segments = 3;
   */
  segments: Segment[] = [];

  constructor(data?: PartialMessage<Transcript>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.Transcript";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "segments", kind: "message", T: Segment, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Transcript {
    return new Transcript().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Transcript {
    return new Transcript().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Transcript {
    return new Transcript().fromJsonString(jsonString, options);
  }

  static equals(a: Transcript | PlainMessage<Transcript> | undefined, b: Transcript | PlainMessage<Transcript> | undefined): boolean {
    return proto3.util.equals(Transcript, a, b);
  }
}

