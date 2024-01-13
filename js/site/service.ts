import { ProtoflowService } from "@/rpc/protoflow_connect";
import { ContentService } from "@/rpc/content/content_connect";
import { UserService } from "@/rpc/user/user_connect";
import {ChatService} from "@/rpc/chat/chat_connect";
import {createConnectTransport} from "@connectrpc/connect-web";
import {createPromiseClient} from "@connectrpc/connect";

export const baseURL = process.env.BASE_URL;

export const transport = createConnectTransport({
  baseUrl: `${baseURL}/api` || 'error',
  // credentials: "include",
});

export const projectService = createPromiseClient(ProtoflowService, transport);
export const contentService = createPromiseClient(ContentService, transport);
export const userService = createPromiseClient(UserService, transport);
export const chatService = createPromiseClient(ChatService, transport);