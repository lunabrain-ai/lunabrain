import {
  TwirpContext,
  TwirpServer,
  RouterEvents,
  TwirpError,
  TwirpErrorCode,
  Interceptor,
  TwirpContentType,
  chainInterceptors,
} from "twirp-ts";
import { Content, ContentID, Query, Results } from "./api";

//==================================//
//          Client Code             //
//==================================//

interface Rpc {
  request(
    service: string,
    method: string,
    contentType: "application/json" | "application/protobuf",
    data: object | Uint8Array
  ): Promise<object | Uint8Array>;
}

export interface APIClient {
  Save(request: Content): Promise<ContentID>;
  Search(request: Query): Promise<Results>;
}

export class APIClientJSON implements APIClient {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Save.bind(this);
    this.Search.bind(this);
  }
  Save(request: Content): Promise<ContentID> {
    const data = Content.toJson(request, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    });
    const promise = this.rpc.request(
      "lunabrain.API",
      "Save",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      ContentID.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }

  Search(request: Query): Promise<Results> {
    const data = Query.toJson(request, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    });
    const promise = this.rpc.request(
      "lunabrain.API",
      "Search",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      Results.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }
}

export class APIClientProtobuf implements APIClient {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Save.bind(this);
    this.Search.bind(this);
  }
  Save(request: Content): Promise<ContentID> {
    const data = Content.toBinary(request);
    const promise = this.rpc.request(
      "lunabrain.API",
      "Save",
      "application/protobuf",
      data
    );
    return promise.then((data) => ContentID.fromBinary(data as Uint8Array));
  }

  Search(request: Query): Promise<Results> {
    const data = Query.toBinary(request);
    const promise = this.rpc.request(
      "lunabrain.API",
      "Search",
      "application/protobuf",
      data
    );
    return promise.then((data) => Results.fromBinary(data as Uint8Array));
  }
}

//==================================//
//          Server Code             //
//==================================//

export interface APITwirp<T extends TwirpContext = TwirpContext> {
  Save(ctx: T, request: Content): Promise<ContentID>;
  Search(ctx: T, request: Query): Promise<Results>;
}

export enum APIMethod {
  Save = "Save",
  Search = "Search",
}

export const APIMethodList = [APIMethod.Save, APIMethod.Search];

export function createAPIServer<T extends TwirpContext = TwirpContext>(
  service: APITwirp<T>
) {
  return new TwirpServer<APITwirp, T>({
    service,
    packageName: "lunabrain",
    serviceName: "API",
    methodList: APIMethodList,
    matchRoute: matchAPIRoute,
  });
}

function matchAPIRoute<T extends TwirpContext = TwirpContext>(
  method: string,
  events: RouterEvents<T>
) {
  switch (method) {
    case "Save":
      return async (
        ctx: T,
        service: APITwirp,
        data: Buffer,
        interceptors?: Interceptor<T, Content, ContentID>[]
      ) => {
        ctx = { ...ctx, methodName: "Save" };
        await events.onMatch(ctx);
        return handleAPISaveRequest(ctx, service, data, interceptors);
      };
    case "Search":
      return async (
        ctx: T,
        service: APITwirp,
        data: Buffer,
        interceptors?: Interceptor<T, Query, Results>[]
      ) => {
        ctx = { ...ctx, methodName: "Search" };
        await events.onMatch(ctx);
        return handleAPISearchRequest(ctx, service, data, interceptors);
      };
    default:
      events.onNotFound();
      const msg = `no handler found`;
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleAPISaveRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: APITwirp,
  data: Buffer,
  interceptors?: Interceptor<T, Content, ContentID>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleAPISaveJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleAPISaveProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleAPISearchRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: APITwirp,
  data: Buffer,
  interceptors?: Interceptor<T, Query, Results>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleAPISearchJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleAPISearchProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}
async function handleAPISaveJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: APITwirp,
  data: Buffer,
  interceptors?: Interceptor<T, Content, ContentID>[]
) {
  let request: Content;
  let response: ContentID;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = Content.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the json request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      Content,
      ContentID
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.Save(ctx, inputReq);
    });
  } else {
    response = await service.Save(ctx, request!);
  }

  return JSON.stringify(
    ContentID.toJson(response, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    }) as string
  );
}

async function handleAPISearchJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: APITwirp,
  data: Buffer,
  interceptors?: Interceptor<T, Query, Results>[]
) {
  let request: Query;
  let response: Results;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = Query.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the json request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      Query,
      Results
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.Search(ctx, inputReq);
    });
  } else {
    response = await service.Search(ctx, request!);
  }

  return JSON.stringify(
    Results.toJson(response, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    }) as string
  );
}
async function handleAPISaveProtobuf<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: APITwirp,
  data: Buffer,
  interceptors?: Interceptor<T, Content, ContentID>[]
) {
  let request: Content;
  let response: ContentID;

  try {
    request = Content.fromBinary(data);
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the protobuf request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      Content,
      ContentID
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.Save(ctx, inputReq);
    });
  } else {
    response = await service.Save(ctx, request!);
  }

  return Buffer.from(ContentID.toBinary(response));
}

async function handleAPISearchProtobuf<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: APITwirp,
  data: Buffer,
  interceptors?: Interceptor<T, Query, Results>[]
) {
  let request: Query;
  let response: Results;

  try {
    request = Query.fromBinary(data);
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the protobuf request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      Query,
      Results
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.Search(ctx, inputReq);
    });
  } else {
    response = await service.Search(ctx, request!);
  }

  return Buffer.from(Results.toBinary(response));
}
