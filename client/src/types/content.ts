import type {ContentType} from "../rpc/api";

export type StoredContent = {
  type: ContentType,
  data: string,
  normal: string,
  createdAt: string
}

