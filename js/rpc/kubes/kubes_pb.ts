// @generated by protoc-gen-es v1.6.0 with parameter "target=ts"
// @generated from file kubes/kubes.proto (package kubes, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message kubes.DeleteDeploymentRequest
 */
export class DeleteDeploymentRequest extends Message<DeleteDeploymentRequest> {
  /**
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * @generated from field: string domain_name = 2;
   */
  domainName = "";

  constructor(data?: PartialMessage<DeleteDeploymentRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "kubes.DeleteDeploymentRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "domain_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteDeploymentRequest {
    return new DeleteDeploymentRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteDeploymentRequest {
    return new DeleteDeploymentRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteDeploymentRequest {
    return new DeleteDeploymentRequest().fromJsonString(jsonString, options);
  }

  static equals(a: DeleteDeploymentRequest | PlainMessage<DeleteDeploymentRequest> | undefined, b: DeleteDeploymentRequest | PlainMessage<DeleteDeploymentRequest> | undefined): boolean {
    return proto3.util.equals(DeleteDeploymentRequest, a, b);
  }
}

/**
 * @generated from message kubes.DeleteDeploymentResponse
 */
export class DeleteDeploymentResponse extends Message<DeleteDeploymentResponse> {
  constructor(data?: PartialMessage<DeleteDeploymentResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "kubes.DeleteDeploymentResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteDeploymentResponse {
    return new DeleteDeploymentResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteDeploymentResponse {
    return new DeleteDeploymentResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteDeploymentResponse {
    return new DeleteDeploymentResponse().fromJsonString(jsonString, options);
  }

  static equals(a: DeleteDeploymentResponse | PlainMessage<DeleteDeploymentResponse> | undefined, b: DeleteDeploymentResponse | PlainMessage<DeleteDeploymentResponse> | undefined): boolean {
    return proto3.util.equals(DeleteDeploymentResponse, a, b);
  }
}

/**
 * @generated from message kubes.ListDeploymentsRequest
 */
export class ListDeploymentsRequest extends Message<ListDeploymentsRequest> {
  /**
   * @generated from field: string namespace = 1;
   */
  namespace = "";

  constructor(data?: PartialMessage<ListDeploymentsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "kubes.ListDeploymentsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "namespace", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDeploymentsRequest {
    return new ListDeploymentsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDeploymentsRequest {
    return new ListDeploymentsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDeploymentsRequest {
    return new ListDeploymentsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: ListDeploymentsRequest | PlainMessage<ListDeploymentsRequest> | undefined, b: ListDeploymentsRequest | PlainMessage<ListDeploymentsRequest> | undefined): boolean {
    return proto3.util.equals(ListDeploymentsRequest, a, b);
  }
}

/**
 * @generated from message kubes.ListDeploymentsResponse
 */
export class ListDeploymentsResponse extends Message<ListDeploymentsResponse> {
  /**
   * @generated from field: repeated kubes.Deployment deployments = 1;
   */
  deployments: Deployment[] = [];

  constructor(data?: PartialMessage<ListDeploymentsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "kubes.ListDeploymentsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "deployments", kind: "message", T: Deployment, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDeploymentsResponse {
    return new ListDeploymentsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDeploymentsResponse {
    return new ListDeploymentsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDeploymentsResponse {
    return new ListDeploymentsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: ListDeploymentsResponse | PlainMessage<ListDeploymentsResponse> | undefined, b: ListDeploymentsResponse | PlainMessage<ListDeploymentsResponse> | undefined): boolean {
    return proto3.util.equals(ListDeploymentsResponse, a, b);
  }
}

/**
 * @generated from message kubes.NewDeploymentRequest
 */
export class NewDeploymentRequest extends Message<NewDeploymentRequest> {
  /**
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * @generated from field: string domain_name = 2;
   */
  domainName = "";

  constructor(data?: PartialMessage<NewDeploymentRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "kubes.NewDeploymentRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "domain_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): NewDeploymentRequest {
    return new NewDeploymentRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): NewDeploymentRequest {
    return new NewDeploymentRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): NewDeploymentRequest {
    return new NewDeploymentRequest().fromJsonString(jsonString, options);
  }

  static equals(a: NewDeploymentRequest | PlainMessage<NewDeploymentRequest> | undefined, b: NewDeploymentRequest | PlainMessage<NewDeploymentRequest> | undefined): boolean {
    return proto3.util.equals(NewDeploymentRequest, a, b);
  }
}

/**
 * @generated from message kubes.NewDeploymentResponse
 */
export class NewDeploymentResponse extends Message<NewDeploymentResponse> {
  /**
   * @generated from field: kubes.Deployment deployment = 1;
   */
  deployment?: Deployment;

  constructor(data?: PartialMessage<NewDeploymentResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "kubes.NewDeploymentResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "deployment", kind: "message", T: Deployment },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): NewDeploymentResponse {
    return new NewDeploymentResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): NewDeploymentResponse {
    return new NewDeploymentResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): NewDeploymentResponse {
    return new NewDeploymentResponse().fromJsonString(jsonString, options);
  }

  static equals(a: NewDeploymentResponse | PlainMessage<NewDeploymentResponse> | undefined, b: NewDeploymentResponse | PlainMessage<NewDeploymentResponse> | undefined): boolean {
    return proto3.util.equals(NewDeploymentResponse, a, b);
  }
}

/**
 * @generated from message kubes.Deployment
 */
export class Deployment extends Message<Deployment> {
  /**
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * @generated from field: string namespace = 2;
   */
  namespace = "";

  /**
   * @generated from field: string image = 3;
   */
  image = "";

  /**
   * @generated from field: int32 replicas = 4;
   */
  replicas = 0;

  /**
   * @generated from field: string status = 5;
   */
  status = "";

  /**
   * @generated from field: string id = 6;
   */
  id = "";

  constructor(data?: PartialMessage<Deployment>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "kubes.Deployment";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "namespace", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "image", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "replicas", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 5, name: "status", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Deployment {
    return new Deployment().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Deployment {
    return new Deployment().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Deployment {
    return new Deployment().fromJsonString(jsonString, options);
  }

  static equals(a: Deployment | PlainMessage<Deployment> | undefined, b: Deployment | PlainMessage<Deployment> | undefined): boolean {
    return proto3.util.equals(Deployment, a, b);
  }
}

