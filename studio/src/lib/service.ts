import {
  createConnectTransport,
} from "@bufbuild/connect-web";
import {createPromiseClient} from "@bufbuild/connect";
import { ProtoflowService } from "@/rpc/protoflow_connect";
import { ContentService } from "@/rpc/content/content_connect";

const apiURL = process.env.API_URL;

const transport = createConnectTransport({
  baseUrl: apiURL || 'http://localhost:8080/api',
});

export const projectService = createPromiseClient(ProtoflowService, transport);
export const contentService = createPromiseClient(ContentService, transport);
