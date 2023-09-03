import {
  createConnectTransport,
} from "@bufbuild/connect-web";
import {createPromiseClient} from "@bufbuild/connect";
import { ProtoflowService } from "@/rpc/protoflow_connect";

const transport = createConnectTransport({
  baseUrl: "/api",
});

export const projectService = createPromiseClient(ProtoflowService, transport);
