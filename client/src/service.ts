import { APIClientJSON } from "./rpc/api.twirp";
import { FetchRPC } from "twirp-ts";

export const api = new APIClientJSON(
	FetchRPC({
		baseUrl: "http://localhost:8080/api",
	}),
);
