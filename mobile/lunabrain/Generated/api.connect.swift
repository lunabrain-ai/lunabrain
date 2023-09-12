// Code generated by protoc-gen-connect-swift. DO NOT EDIT.
//
// Source: api.proto
//

import Connect
import Foundation
import SwiftProtobuf

public protocol Lunabrain_ApiClientInterface {

    @discardableResult
    func `save`(request: Lunabrain_Contents, headers: Connect.Headers, completion: @escaping (ResponseMessage<Lunabrain_ContentIDs>) -> Void) -> Connect.Cancelable

    @available(iOS 13, *)
    func `save`(request: Lunabrain_Contents, headers: Connect.Headers) async -> ResponseMessage<Lunabrain_ContentIDs>

    @discardableResult
    func `search`(request: Lunabrain_Query, headers: Connect.Headers, completion: @escaping (ResponseMessage<Lunabrain_Results>) -> Void) -> Connect.Cancelable

    @available(iOS 13, *)
    func `search`(request: Lunabrain_Query, headers: Connect.Headers) async -> ResponseMessage<Lunabrain_Results>
}

/// Concrete implementation of `Lunabrain_ApiClientInterface`.
public final class Lunabrain_ApiClient: Lunabrain_ApiClientInterface {
    private let client: Connect.ProtocolClientInterface

    public init(client: Connect.ProtocolClientInterface) {
        self.client = client
    }

    @discardableResult
    public func `save`(request: Lunabrain_Contents, headers: Connect.Headers = [:], completion: @escaping (ResponseMessage<Lunabrain_ContentIDs>) -> Void) -> Connect.Cancelable {
        return self.client.unary(path: "lunabrain.API/Save", request: request, headers: headers, completion: completion)
    }

    @available(iOS 13, *)
    public func `save`(request: Lunabrain_Contents, headers: Connect.Headers = [:]) async -> ResponseMessage<Lunabrain_ContentIDs> {
        return await self.client.unary(path: "lunabrain.API/Save", request: request, headers: headers)
    }

    @discardableResult
    public func `search`(request: Lunabrain_Query, headers: Connect.Headers = [:], completion: @escaping (ResponseMessage<Lunabrain_Results>) -> Void) -> Connect.Cancelable {
        return self.client.unary(path: "lunabrain.API/Search", request: request, headers: headers, completion: completion)
    }

    @available(iOS 13, *)
    public func `search`(request: Lunabrain_Query, headers: Connect.Headers = [:]) async -> ResponseMessage<Lunabrain_Results> {
        return await self.client.unary(path: "lunabrain.API/Search", request: request, headers: headers)
    }

    public enum Metadata {
        public enum Methods {
            public static let save = Connect.MethodSpec(name: "Save", service: "lunabrain.API", type: .unary)
            public static let search = Connect.MethodSpec(name: "Search", service: "lunabrain.API", type: .unary)
        }
    }
}

public protocol Lunabrain_DiscordServiceClientInterface {

    func `readMessages`(headers: Connect.Headers, onResult: @escaping (Connect.StreamResult<Lunabrain_ReadMessagesResponse>) -> Void) -> any Connect.ServerOnlyStreamInterface<Lunabrain_ReadMessagesRequest>

    @available(iOS 13, *)
    func `readMessages`(headers: Connect.Headers) -> any Connect.ServerOnlyAsyncStreamInterface<Lunabrain_ReadMessagesRequest, Lunabrain_ReadMessagesResponse>

    @discardableResult
    func `writeMessage`(request: Lunabrain_WriteMessageRequest, headers: Connect.Headers, completion: @escaping (ResponseMessage<Lunabrain_WriteMessageResponse>) -> Void) -> Connect.Cancelable

    @available(iOS 13, *)
    func `writeMessage`(request: Lunabrain_WriteMessageRequest, headers: Connect.Headers) async -> ResponseMessage<Lunabrain_WriteMessageResponse>
}

/// Concrete implementation of `Lunabrain_DiscordServiceClientInterface`.
public final class Lunabrain_DiscordServiceClient: Lunabrain_DiscordServiceClientInterface {
    private let client: Connect.ProtocolClientInterface

    public init(client: Connect.ProtocolClientInterface) {
        self.client = client
    }

    public func `readMessages`(headers: Connect.Headers = [:], onResult: @escaping (Connect.StreamResult<Lunabrain_ReadMessagesResponse>) -> Void) -> any Connect.ServerOnlyStreamInterface<Lunabrain_ReadMessagesRequest> {
        return self.client.serverOnlyStream(path: "lunabrain.DiscordService/ReadMessages", headers: headers, onResult: onResult)
    }

    @available(iOS 13, *)
    public func `readMessages`(headers: Connect.Headers = [:]) -> any Connect.ServerOnlyAsyncStreamInterface<Lunabrain_ReadMessagesRequest, Lunabrain_ReadMessagesResponse> {
        return self.client.serverOnlyStream(path: "lunabrain.DiscordService/ReadMessages", headers: headers)
    }

    @discardableResult
    public func `writeMessage`(request: Lunabrain_WriteMessageRequest, headers: Connect.Headers = [:], completion: @escaping (ResponseMessage<Lunabrain_WriteMessageResponse>) -> Void) -> Connect.Cancelable {
        return self.client.unary(path: "lunabrain.DiscordService/WriteMessage", request: request, headers: headers, completion: completion)
    }

    @available(iOS 13, *)
    public func `writeMessage`(request: Lunabrain_WriteMessageRequest, headers: Connect.Headers = [:]) async -> ResponseMessage<Lunabrain_WriteMessageResponse> {
        return await self.client.unary(path: "lunabrain.DiscordService/WriteMessage", request: request, headers: headers)
    }

    public enum Metadata {
        public enum Methods {
            public static let readMessages = Connect.MethodSpec(name: "ReadMessages", service: "lunabrain.DiscordService", type: .serverStream)
            public static let writeMessage = Connect.MethodSpec(name: "WriteMessage", service: "lunabrain.DiscordService", type: .unary)
        }
    }
}
