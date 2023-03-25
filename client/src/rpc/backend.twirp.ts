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
import { File, Transcription } from "./backend";

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

export interface BackendClient {
  Transcribe(request: File): Promise<Transcription>;
}

export class BackendClientJSON implements BackendClient {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Transcribe.bind(this);
  }
  Transcribe(request: File): Promise<Transcription> {
    const data = File.toJson(request, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    });
    const promise = this.rpc.request(
      "python.Backend",
      "Transcribe",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      Transcription.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }
}

export class BackendClientProtobuf implements BackendClient {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Transcribe.bind(this);
  }
  Transcribe(request: File): Promise<Transcription> {
    const data = File.toBinary(request);
    const promise = this.rpc.request(
      "python.Backend",
      "Transcribe",
      "application/protobuf",
      data
    );
    return promise.then((data) => Transcription.fromBinary(data as Uint8Array));
  }
}

//==================================//
//          Server Code             //
//==================================//

export interface BackendTwirp<T extends TwirpContext = TwirpContext> {
  Transcribe(ctx: T, request: File): Promise<Transcription>;
}

export enum BackendMethod {
  Transcribe = "Transcribe",
}

export const BackendMethodList = [BackendMethod.Transcribe];

export function createBackendServer<T extends TwirpContext = TwirpContext>(
  service: BackendTwirp<T>
) {
  return new TwirpServer<BackendTwirp, T>({
    service,
    packageName: "python",
    serviceName: "Backend",
    methodList: BackendMethodList,
    matchRoute: matchBackendRoute,
  });
}

function matchBackendRoute<T extends TwirpContext = TwirpContext>(
  method: string,
  events: RouterEvents<T>
) {
  switch (method) {
    case "Transcribe":
      return async (
        ctx: T,
        service: BackendTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, File, Transcription>[]
      ) => {
        ctx = { ...ctx, methodName: "Transcribe" };
        await events.onMatch(ctx);
        return handleBackendTranscribeRequest(ctx, service, data, interceptors);
      };
    default:
      events.onNotFound();
      const msg = `no handler found`;
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleBackendTranscribeRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: BackendTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, File, Transcription>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleBackendTranscribeJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleBackendTranscribeProtobuf<T>(
        ctx,
        service,
        data,
        interceptors
      );
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}
async function handleBackendTranscribeJSON<
  T extends TwirpContext = TwirpContext
>(
  ctx: T,
  service: BackendTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, File, Transcription>[]
) {
  let request: File;
  let response: Transcription;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = File.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the json request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      File,
      Transcription
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.Transcribe(ctx, inputReq);
    });
  } else {
    response = await service.Transcribe(ctx, request!);
  }

  return JSON.stringify(
    Transcription.toJson(response, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    }) as string
  );
}
async function handleBackendTranscribeProtobuf<
  T extends TwirpContext = TwirpContext
>(
  ctx: T,
  service: BackendTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, File, Transcription>[]
) {
  let request: File;
  let response: Transcription;

  try {
    request = File.fromBinary(data);
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the protobuf request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      File,
      Transcription
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.Transcribe(ctx, inputReq);
    });
  } else {
    response = await service.Transcribe(ctx, request!);
  }

  return Buffer.from(Transcription.toBinary(response));
}
