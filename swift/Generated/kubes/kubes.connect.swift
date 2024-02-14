// Code generated by protoc-gen-connect-swift. DO NOT EDIT.
//
// Source: kubes/kubes.proto
//

import Connect
import Foundation
import SwiftProtobuf

public protocol Kubes_KubesServiceClientInterface: Sendable {

    @discardableResult
    func `listDeployments`(request: Kubes_ListDeploymentsRequest, headers: Connect.Headers, completion: @escaping @Sendable (ResponseMessage<Kubes_ListDeploymentsResponse>) -> Void) -> Connect.Cancelable

    @available(iOS 13, *)
    func `listDeployments`(request: Kubes_ListDeploymentsRequest, headers: Connect.Headers) async -> ResponseMessage<Kubes_ListDeploymentsResponse>

    @discardableResult
    func `newDeployment`(request: Kubes_NewDeploymentRequest, headers: Connect.Headers, completion: @escaping @Sendable (ResponseMessage<Kubes_NewDeploymentResponse>) -> Void) -> Connect.Cancelable

    @available(iOS 13, *)
    func `newDeployment`(request: Kubes_NewDeploymentRequest, headers: Connect.Headers) async -> ResponseMessage<Kubes_NewDeploymentResponse>

    @discardableResult
    func `deleteDeployment`(request: Kubes_DeleteDeploymentRequest, headers: Connect.Headers, completion: @escaping @Sendable (ResponseMessage<Kubes_DeleteDeploymentResponse>) -> Void) -> Connect.Cancelable

    @available(iOS 13, *)
    func `deleteDeployment`(request: Kubes_DeleteDeploymentRequest, headers: Connect.Headers) async -> ResponseMessage<Kubes_DeleteDeploymentResponse>
}

/// Concrete implementation of `Kubes_KubesServiceClientInterface`.
public final class Kubes_KubesServiceClient: Kubes_KubesServiceClientInterface, Sendable {
    private let client: Connect.ProtocolClientInterface

    public init(client: Connect.ProtocolClientInterface) {
        self.client = client
    }

    @discardableResult
    public func `listDeployments`(request: Kubes_ListDeploymentsRequest, headers: Connect.Headers = [:], completion: @escaping @Sendable (ResponseMessage<Kubes_ListDeploymentsResponse>) -> Void) -> Connect.Cancelable {
        return self.client.unary(path: "/kubes.KubesService/ListDeployments", request: request, headers: headers, completion: completion)
    }

    @available(iOS 13, *)
    public func `listDeployments`(request: Kubes_ListDeploymentsRequest, headers: Connect.Headers = [:]) async -> ResponseMessage<Kubes_ListDeploymentsResponse> {
        return await self.client.unary(path: "/kubes.KubesService/ListDeployments", request: request, headers: headers)
    }

    @discardableResult
    public func `newDeployment`(request: Kubes_NewDeploymentRequest, headers: Connect.Headers = [:], completion: @escaping @Sendable (ResponseMessage<Kubes_NewDeploymentResponse>) -> Void) -> Connect.Cancelable {
        return self.client.unary(path: "/kubes.KubesService/NewDeployment", request: request, headers: headers, completion: completion)
    }

    @available(iOS 13, *)
    public func `newDeployment`(request: Kubes_NewDeploymentRequest, headers: Connect.Headers = [:]) async -> ResponseMessage<Kubes_NewDeploymentResponse> {
        return await self.client.unary(path: "/kubes.KubesService/NewDeployment", request: request, headers: headers)
    }

    @discardableResult
    public func `deleteDeployment`(request: Kubes_DeleteDeploymentRequest, headers: Connect.Headers = [:], completion: @escaping @Sendable (ResponseMessage<Kubes_DeleteDeploymentResponse>) -> Void) -> Connect.Cancelable {
        return self.client.unary(path: "/kubes.KubesService/DeleteDeployment", request: request, headers: headers, completion: completion)
    }

    @available(iOS 13, *)
    public func `deleteDeployment`(request: Kubes_DeleteDeploymentRequest, headers: Connect.Headers = [:]) async -> ResponseMessage<Kubes_DeleteDeploymentResponse> {
        return await self.client.unary(path: "/kubes.KubesService/DeleteDeployment", request: request, headers: headers)
    }

    public enum Metadata {
        public enum Methods {
            public static let listDeployments = Connect.MethodSpec(name: "ListDeployments", service: "kubes.KubesService", type: .unary)
            public static let newDeployment = Connect.MethodSpec(name: "NewDeployment", service: "kubes.KubesService", type: .unary)
            public static let deleteDeployment = Connect.MethodSpec(name: "DeleteDeployment", service: "kubes.KubesService", type: .unary)
        }
    }
}