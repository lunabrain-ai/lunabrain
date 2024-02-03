// @generated by protoc-gen-es v1.6.0 with parameter "target=ts"
// @generated from file analytics/analytics.proto (package analytics, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";

/**
 * @generated from message analytics.Metric
 */
export class Metric extends Message<Metric> {
  /**
   * @generated from oneof analytics.Metric.type
   */
  type: {
    /**
     * @generated from field: analytics.HTTPRequest http = 1;
     */
    value: HTTPRequest;
    case: "http";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<Metric>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "analytics.Metric";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "http", kind: "message", T: HTTPRequest, oneof: "type" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Metric {
    return new Metric().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Metric {
    return new Metric().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Metric {
    return new Metric().fromJsonString(jsonString, options);
  }

  static equals(a: Metric | PlainMessage<Metric> | undefined, b: Metric | PlainMessage<Metric> | undefined): boolean {
    return proto3.util.equals(Metric, a, b);
  }
}

/**
 * @generated from message analytics.HTTPRequest
 */
export class HTTPRequest extends Message<HTTPRequest> {
  /**
   * @generated from field: string method = 1;
   */
  method = "";

  /**
   * @generated from field: string url = 2;
   */
  url = "";

  /**
   * @generated from field: string proto = 3;
   */
  proto = "";

  /**
   * @generated from field: map<string, string> headers = 4;
   */
  headers: { [key: string]: string } = {};

  /**
   * @generated from field: string host = 5;
   */
  host = "";

  /**
   * @generated from field: string remoteAddr = 6;
   */
  remoteAddr = "";

  /**
   * @generated from field: string userAgent = 7;
   */
  userAgent = "";

  /**
   * @generated from field: google.protobuf.Timestamp timestamp = 8;
   */
  timestamp?: Timestamp;

  constructor(data?: PartialMessage<HTTPRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "analytics.HTTPRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "method", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "proto", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "headers", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "scalar", T: 9 /* ScalarType.STRING */} },
    { no: 5, name: "host", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "remoteAddr", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "userAgent", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 8, name: "timestamp", kind: "message", T: Timestamp },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): HTTPRequest {
    return new HTTPRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): HTTPRequest {
    return new HTTPRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): HTTPRequest {
    return new HTTPRequest().fromJsonString(jsonString, options);
  }

  static equals(a: HTTPRequest | PlainMessage<HTTPRequest> | undefined, b: HTTPRequest | PlainMessage<HTTPRequest> | undefined): boolean {
    return proto3.util.equals(HTTPRequest, a, b);
  }
}
