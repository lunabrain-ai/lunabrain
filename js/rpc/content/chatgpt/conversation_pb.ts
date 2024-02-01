// @generated by protoc-gen-es v1.6.0 with parameter "target=ts"
// @generated from file content/chatgpt/conversation.proto (package chatgpt, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message as Message$1, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message chatgpt.Conversation
 */
export class Conversation extends Message$1<Conversation> {
  /**
   * @generated from field: string title = 1;
   */
  title = "";

  /**
   * @generated from field: double create_time = 2;
   */
  createTime = 0;

  /**
   * @generated from field: double update_time = 3;
   */
  updateTime = 0;

  /**
   * @generated from field: map<string, chatgpt.Node> mapping = 4;
   */
  mapping: { [key: string]: Node } = {};

  /**
   * @generated from field: string conversation_id = 5;
   */
  conversationId = "";

  /**
   * @generated from field: string conversation_template_id = 6;
   */
  conversationTemplateId = "";

  /**
   * @generated from field: string current_node = 7;
   */
  currentNode = "";

  /**
   * @generated from field: string gizmo_id = 8;
   */
  gizmoId = "";

  /**
   * moderation_results = []
   * plugin_ids = null
   * safe_urls = []
   *
   * @generated from field: bool is_archived = 9;
   */
  isArchived = false;

  constructor(data?: PartialMessage<Conversation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "chatgpt.Conversation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "create_time", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
    { no: 3, name: "update_time", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
    { no: 4, name: "mapping", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "message", T: Node} },
    { no: 5, name: "conversation_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "conversation_template_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "current_node", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 8, name: "gizmo_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 9, name: "is_archived", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Conversation {
    return new Conversation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Conversation {
    return new Conversation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Conversation {
    return new Conversation().fromJsonString(jsonString, options);
  }

  static equals(a: Conversation | PlainMessage<Conversation> | undefined, b: Conversation | PlainMessage<Conversation> | undefined): boolean {
    return proto3.util.equals(Conversation, a, b);
  }
}

/**
 * @generated from message chatgpt.Node
 */
export class Node extends Message$1<Node> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * @generated from field: chatgpt.Message message = 2;
   */
  message?: Message;

  /**
   * @generated from field: string parent = 3;
   */
  parent = "";

  /**
   * @generated from field: repeated string children = 4;
   */
  children: string[] = [];

  constructor(data?: PartialMessage<Node>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "chatgpt.Node";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "message", kind: "message", T: Message },
    { no: 3, name: "parent", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "children", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Node {
    return new Node().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Node {
    return new Node().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Node {
    return new Node().fromJsonString(jsonString, options);
  }

  static equals(a: Node | PlainMessage<Node> | undefined, b: Node | PlainMessage<Node> | undefined): boolean {
    return proto3.util.equals(Node, a, b);
  }
}

/**
 * @generated from message chatgpt.Message
 */
export class Message extends Message$1<Message> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * @generated from field: chatgpt.Author author = 2;
   */
  author?: Author;

  /**
   * Optional, based on usage in JSON
   *
   * @generated from field: double create_time = 3;
   */
  createTime = 0;

  /**
   * @generated from field: chatgpt.Content content = 4;
   */
  content?: Content;

  /**
   * @generated from field: string status = 5;
   */
  status = "";

  /**
   * Optional, based on usage in JSON
   *
   * @generated from field: bool end_turn = 6;
   */
  endTurn = false;

  /**
   * @generated from field: int32 weight = 7;
   */
  weight = 0;

  /**
   * @generated from field: chatgpt.MessageMetadata metadata = 8;
   */
  metadata?: MessageMetadata;

  /**
   * @generated from field: string recipient = 9;
   */
  recipient = "";

  /**
   * @generated from field: double update_time = 10;
   */
  updateTime = 0;

  constructor(data?: PartialMessage<Message>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "chatgpt.Message";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "author", kind: "message", T: Author },
    { no: 3, name: "create_time", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
    { no: 4, name: "content", kind: "message", T: Content },
    { no: 5, name: "status", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "end_turn", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 7, name: "weight", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 8, name: "metadata", kind: "message", T: MessageMetadata },
    { no: 9, name: "recipient", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 10, name: "update_time", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Message {
    return new Message().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Message {
    return new Message().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Message {
    return new Message().fromJsonString(jsonString, options);
  }

  static equals(a: Message | PlainMessage<Message> | undefined, b: Message | PlainMessage<Message> | undefined): boolean {
    return proto3.util.equals(Message, a, b);
  }
}

/**
 * @generated from message chatgpt.MessageMetadata
 */
export class MessageMetadata extends Message$1<MessageMetadata> {
  constructor(data?: PartialMessage<MessageMetadata>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "chatgpt.MessageMetadata";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MessageMetadata {
    return new MessageMetadata().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MessageMetadata {
    return new MessageMetadata().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MessageMetadata {
    return new MessageMetadata().fromJsonString(jsonString, options);
  }

  static equals(a: MessageMetadata | PlainMessage<MessageMetadata> | undefined, b: MessageMetadata | PlainMessage<MessageMetadata> | undefined): boolean {
    return proto3.util.equals(MessageMetadata, a, b);
  }
}

/**
 * @generated from message chatgpt.Author
 */
export class Author extends Message$1<Author> {
  /**
   * @generated from field: string role = 1;
   */
  role = "";

  /**
   * @generated from field: chatgpt.AuthorMetadata metadata = 2;
   */
  metadata?: AuthorMetadata;

  /**
   * @generated from field: string name = 3;
   */
  name = "";

  constructor(data?: PartialMessage<Author>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "chatgpt.Author";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "role", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "metadata", kind: "message", T: AuthorMetadata },
    { no: 3, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Author {
    return new Author().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Author {
    return new Author().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Author {
    return new Author().fromJsonString(jsonString, options);
  }

  static equals(a: Author | PlainMessage<Author> | undefined, b: Author | PlainMessage<Author> | undefined): boolean {
    return proto3.util.equals(Author, a, b);
  }
}

/**
 * @generated from message chatgpt.Content
 */
export class Content extends Message$1<Content> {
  /**
   * "text" or "dalle.text2im", prob others too
   *
   * @generated from field: string content_type = 1;
   */
  contentType = "";

  /**
   * TODO breadchris make this work for images
   * google.protobuf.Value parts = 2;
   *
   * @generated from field: repeated string parts = 2;
   */
  parts: string[] = [];

  constructor(data?: PartialMessage<Content>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "chatgpt.Content";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "content_type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "parts", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
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
 * @generated from message chatgpt.AuthorMetadata
 */
export class AuthorMetadata extends Message$1<AuthorMetadata> {
  /**
   * This message can be extended based on the different key-value pairs found in your JSON's metadata.
   * For example:
   *
   * @generated from field: repeated chatgpt.Attachment attachments = 1;
   */
  attachments: Attachment[] = [];

  /**
   * Use string for timestamps to avoid precision issues, or use int64/uint64 if they represent epoch time.
   *
   * @generated from field: string timestamp_ = 2;
   */
  timestamp = "";

  constructor(data?: PartialMessage<AuthorMetadata>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "chatgpt.AuthorMetadata";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "attachments", kind: "message", T: Attachment, repeated: true },
    { no: 2, name: "timestamp_", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AuthorMetadata {
    return new AuthorMetadata().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AuthorMetadata {
    return new AuthorMetadata().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AuthorMetadata {
    return new AuthorMetadata().fromJsonString(jsonString, options);
  }

  static equals(a: AuthorMetadata | PlainMessage<AuthorMetadata> | undefined, b: AuthorMetadata | PlainMessage<AuthorMetadata> | undefined): boolean {
    return proto3.util.equals(AuthorMetadata, a, b);
  }
}

/**
 * @generated from message chatgpt.Attachment
 */
export class Attachment extends Message$1<Attachment> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * @generated from field: string name = 2;
   */
  name = "";

  /**
   * @generated from field: string mimeType = 3;
   */
  mimeType = "";

  constructor(data?: PartialMessage<Attachment>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "chatgpt.Attachment";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "mimeType", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Attachment {
    return new Attachment().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Attachment {
    return new Attachment().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Attachment {
    return new Attachment().fromJsonString(jsonString, options);
  }

  static equals(a: Attachment | PlainMessage<Attachment> | undefined, b: Attachment | PlainMessage<Attachment> | undefined): boolean {
    return proto3.util.equals(Attachment, a, b);
  }
}

