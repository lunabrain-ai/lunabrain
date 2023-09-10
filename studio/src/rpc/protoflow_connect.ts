// @generated by protoc-gen-connect-es v0.11.0 with parameter "target=ts"
// @generated from file protoflow.proto (package protoflow, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { ChatRequest, ChatResponse, ConvertFileRequest, DeleteSessionRequest, Empty, FilePath, GetPromptsRequest, GetPromptsResponse, GetSessionRequest, GetSessionResponse, GetSessionsRequest, GetSessionsResponse, InferRequest, InferResponse, OCRText, Prompt, UploadContentRequest, User, YouTubeVideo } from "./protoflow_pb.js";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service protoflow.ProtoflowService
 */
export const ProtoflowService = {
  typeName: "protoflow.ProtoflowService",
  methods: {
    /**
     * @generated from rpc protoflow.ProtoflowService.DownloadYouTubeVideo
     */
    downloadYouTubeVideo: {
      name: "DownloadYouTubeVideo",
      I: YouTubeVideo,
      O: FilePath,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc protoflow.ProtoflowService.GetSessions
     */
    getSessions: {
      name: "GetSessions",
      I: GetSessionsRequest,
      O: GetSessionsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc protoflow.ProtoflowService.GetSession
     */
    getSession: {
      name: "GetSession",
      I: GetSessionRequest,
      O: GetSessionResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc protoflow.ProtoflowService.DeleteSession
     */
    deleteSession: {
      name: "DeleteSession",
      I: DeleteSessionRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc protoflow.ProtoflowService.GetPrompts
     */
    getPrompts: {
      name: "GetPrompts",
      I: GetPromptsRequest,
      O: GetPromptsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc protoflow.ProtoflowService.NewPrompt
     */
    newPrompt: {
      name: "NewPrompt",
      I: Prompt,
      O: Prompt,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc protoflow.ProtoflowService.UploadContent
     */
    uploadContent: {
      name: "UploadContent",
      I: UploadContentRequest,
      O: ChatResponse,
      kind: MethodKind.ServerStreaming,
    },
    /**
     * @generated from rpc protoflow.ProtoflowService.Infer
     */
    infer: {
      name: "Infer",
      I: InferRequest,
      O: InferResponse,
      kind: MethodKind.ServerStreaming,
    },
    /**
     * @generated from rpc protoflow.ProtoflowService.Chat
     */
    chat: {
      name: "Chat",
      I: ChatRequest,
      O: ChatResponse,
      kind: MethodKind.ServerStreaming,
    },
    /**
     * @generated from rpc protoflow.ProtoflowService.ConvertFile
     */
    convertFile: {
      name: "ConvertFile",
      I: ConvertFileRequest,
      O: FilePath,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc protoflow.ProtoflowService.OCR
     */
    oCR: {
      name: "OCR",
      I: FilePath,
      O: OCRText,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc protoflow.ProtoflowService.Register
     */
    register: {
      name: "Register",
      I: User,
      O: User,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc protoflow.ProtoflowService.Login
     */
    login: {
      name: "Login",
      I: User,
      O: User,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc protoflow.ProtoflowService.Logout
     */
    logout: {
      name: "Logout",
      I: Empty,
      O: Empty,
      kind: MethodKind.Unary,
    },
  }
} as const;

