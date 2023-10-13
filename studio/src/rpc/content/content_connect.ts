// @generated by protoc-gen-connect-es v0.13.0 with parameter "target=ts"
// @generated from file content/content.proto (package content, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { Content, ContentIDs, Contents, Query, Results, TagRequest, Tags, VoteRequest, VoteResponse } from "./content_pb.js";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service content.ContentService
 */
export const ContentService = {
  typeName: "content.ContentService",
  methods: {
    /**
     * @generated from rpc content.ContentService.Save
     */
    save: {
      name: "Save",
      I: Contents,
      O: ContentIDs,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc content.ContentService.Search
     */
    search: {
      name: "Search",
      I: Query,
      O: Results,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc content.ContentService.Analyze
     */
    analyze: {
      name: "Analyze",
      I: Content,
      O: Contents,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc content.ContentService.Delete
     */
    delete: {
      name: "Delete",
      I: ContentIDs,
      O: ContentIDs,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc content.ContentService.GetTags
     */
    getTags: {
      name: "GetTags",
      I: TagRequest,
      O: Tags,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc content.ContentService.Vote
     */
    vote: {
      name: "Vote",
      I: VoteRequest,
      O: VoteResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

