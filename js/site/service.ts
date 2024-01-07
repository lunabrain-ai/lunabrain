import {
  createConnectTransport,
} from "@bufbuild/connect-web";
import {createPromiseClient} from "@bufbuild/connect";
import { ProtoflowService } from "@/rpc/protoflow_connect";
import { ContentService } from "@/rpc/content/content_connect";
import { UserService } from "./rpc/user/user_connect";
import {QueryClient} from "@tanstack/react-query";

export const baseURL = process.env.BASE_URL;

export const queryClient = new QueryClient();
export const transport = createConnectTransport({
  baseUrl: `${baseURL}/api` || 'error',
  // credentials: "include",
});

export const projectService = createPromiseClient(ProtoflowService, transport);
export const contentService = createPromiseClient(ContentService, transport);
export const userService = createPromiseClient(UserService, transport);
