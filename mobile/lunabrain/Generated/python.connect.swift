// Code generated by protoc-gen-connect-swift. DO NOT EDIT.
//
// Source: python.proto
//

import Connect
import Foundation
import SwiftProtobuf

public protocol Python_PythonClientInterface {

    @discardableResult
    func `transcribe`(request: Python_TranscribeRequest, headers: Connect.Headers, completion: @escaping (ResponseMessage<Python_TranscribeResponse>) -> Void) -> Connect.Cancelable

    @available(iOS 13, *)
    func `transcribe`(request: Python_TranscribeRequest, headers: Connect.Headers) async -> ResponseMessage<Python_TranscribeResponse>

    @discardableResult
    func `summarize`(request: Python_SummarizeRequest, headers: Connect.Headers, completion: @escaping (ResponseMessage<Python_SummarizeResponse>) -> Void) -> Connect.Cancelable

    @available(iOS 13, *)
    func `summarize`(request: Python_SummarizeRequest, headers: Connect.Headers) async -> ResponseMessage<Python_SummarizeResponse>

    @discardableResult
    func `youtubeTranscript`(request: Python_Video, headers: Connect.Headers, completion: @escaping (ResponseMessage<Python_Transcript>) -> Void) -> Connect.Cancelable

    @available(iOS 13, *)
    func `youtubeTranscript`(request: Python_Video, headers: Connect.Headers) async -> ResponseMessage<Python_Transcript>

    @discardableResult
    func `normalize`(request: Python_Text, headers: Connect.Headers, completion: @escaping (ResponseMessage<Python_Text>) -> Void) -> Connect.Cancelable

    @available(iOS 13, *)
    func `normalize`(request: Python_Text, headers: Connect.Headers) async -> ResponseMessage<Python_Text>

    @discardableResult
    func `categorize`(request: Python_CategorizeRequest, headers: Connect.Headers, completion: @escaping (ResponseMessage<Python_Categories>) -> Void) -> Connect.Cancelable

    @available(iOS 13, *)
    func `categorize`(request: Python_CategorizeRequest, headers: Connect.Headers) async -> ResponseMessage<Python_Categories>

    @discardableResult
    func `indexDirectory`(request: Python_IndexDirectoryRequest, headers: Connect.Headers, completion: @escaping (ResponseMessage<Python_Index>) -> Void) -> Connect.Cancelable

    @available(iOS 13, *)
    func `indexDirectory`(request: Python_IndexDirectoryRequest, headers: Connect.Headers) async -> ResponseMessage<Python_Index>

    @discardableResult
    func `queryIndex`(request: Python_IndexQuery, headers: Connect.Headers, completion: @escaping (ResponseMessage<Python_QueryResult>) -> Void) -> Connect.Cancelable

    @available(iOS 13, *)
    func `queryIndex`(request: Python_IndexQuery, headers: Connect.Headers) async -> ResponseMessage<Python_QueryResult>
}

/// Concrete implementation of `Python_PythonClientInterface`.
public final class Python_PythonClient: Python_PythonClientInterface {
    private let client: Connect.ProtocolClientInterface

    public init(client: Connect.ProtocolClientInterface) {
        self.client = client
    }

    @discardableResult
    public func `transcribe`(request: Python_TranscribeRequest, headers: Connect.Headers = [:], completion: @escaping (ResponseMessage<Python_TranscribeResponse>) -> Void) -> Connect.Cancelable {
        return self.client.unary(path: "python.Python/Transcribe", request: request, headers: headers, completion: completion)
    }

    @available(iOS 13, *)
    public func `transcribe`(request: Python_TranscribeRequest, headers: Connect.Headers = [:]) async -> ResponseMessage<Python_TranscribeResponse> {
        return await self.client.unary(path: "python.Python/Transcribe", request: request, headers: headers)
    }

    @discardableResult
    public func `summarize`(request: Python_SummarizeRequest, headers: Connect.Headers = [:], completion: @escaping (ResponseMessage<Python_SummarizeResponse>) -> Void) -> Connect.Cancelable {
        return self.client.unary(path: "python.Python/Summarize", request: request, headers: headers, completion: completion)
    }

    @available(iOS 13, *)
    public func `summarize`(request: Python_SummarizeRequest, headers: Connect.Headers = [:]) async -> ResponseMessage<Python_SummarizeResponse> {
        return await self.client.unary(path: "python.Python/Summarize", request: request, headers: headers)
    }

    @discardableResult
    public func `youtubeTranscript`(request: Python_Video, headers: Connect.Headers = [:], completion: @escaping (ResponseMessage<Python_Transcript>) -> Void) -> Connect.Cancelable {
        return self.client.unary(path: "python.Python/YoutubeTranscript", request: request, headers: headers, completion: completion)
    }

    @available(iOS 13, *)
    public func `youtubeTranscript`(request: Python_Video, headers: Connect.Headers = [:]) async -> ResponseMessage<Python_Transcript> {
        return await self.client.unary(path: "python.Python/YoutubeTranscript", request: request, headers: headers)
    }

    @discardableResult
    public func `normalize`(request: Python_Text, headers: Connect.Headers = [:], completion: @escaping (ResponseMessage<Python_Text>) -> Void) -> Connect.Cancelable {
        return self.client.unary(path: "python.Python/Normalize", request: request, headers: headers, completion: completion)
    }

    @available(iOS 13, *)
    public func `normalize`(request: Python_Text, headers: Connect.Headers = [:]) async -> ResponseMessage<Python_Text> {
        return await self.client.unary(path: "python.Python/Normalize", request: request, headers: headers)
    }

    @discardableResult
    public func `categorize`(request: Python_CategorizeRequest, headers: Connect.Headers = [:], completion: @escaping (ResponseMessage<Python_Categories>) -> Void) -> Connect.Cancelable {
        return self.client.unary(path: "python.Python/Categorize", request: request, headers: headers, completion: completion)
    }

    @available(iOS 13, *)
    public func `categorize`(request: Python_CategorizeRequest, headers: Connect.Headers = [:]) async -> ResponseMessage<Python_Categories> {
        return await self.client.unary(path: "python.Python/Categorize", request: request, headers: headers)
    }

    @discardableResult
    public func `indexDirectory`(request: Python_IndexDirectoryRequest, headers: Connect.Headers = [:], completion: @escaping (ResponseMessage<Python_Index>) -> Void) -> Connect.Cancelable {
        return self.client.unary(path: "python.Python/IndexDirectory", request: request, headers: headers, completion: completion)
    }

    @available(iOS 13, *)
    public func `indexDirectory`(request: Python_IndexDirectoryRequest, headers: Connect.Headers = [:]) async -> ResponseMessage<Python_Index> {
        return await self.client.unary(path: "python.Python/IndexDirectory", request: request, headers: headers)
    }

    @discardableResult
    public func `queryIndex`(request: Python_IndexQuery, headers: Connect.Headers = [:], completion: @escaping (ResponseMessage<Python_QueryResult>) -> Void) -> Connect.Cancelable {
        return self.client.unary(path: "python.Python/QueryIndex", request: request, headers: headers, completion: completion)
    }

    @available(iOS 13, *)
    public func `queryIndex`(request: Python_IndexQuery, headers: Connect.Headers = [:]) async -> ResponseMessage<Python_QueryResult> {
        return await self.client.unary(path: "python.Python/QueryIndex", request: request, headers: headers)
    }

    public enum Metadata {
        public enum Methods {
            public static let transcribe = Connect.MethodSpec(name: "Transcribe", service: "python.Python", type: .unary)
            public static let summarize = Connect.MethodSpec(name: "Summarize", service: "python.Python", type: .unary)
            public static let youtubeTranscript = Connect.MethodSpec(name: "YoutubeTranscript", service: "python.Python", type: .unary)
            public static let normalize = Connect.MethodSpec(name: "Normalize", service: "python.Python", type: .unary)
            public static let categorize = Connect.MethodSpec(name: "Categorize", service: "python.Python", type: .unary)
            public static let indexDirectory = Connect.MethodSpec(name: "IndexDirectory", service: "python.Python", type: .unary)
            public static let queryIndex = Connect.MethodSpec(name: "QueryIndex", service: "python.Python", type: .unary)
        }
    }
}
