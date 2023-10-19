// DO NOT EDIT.
// swift-format-ignore-file
//
// Generated by the Swift generator plugin for the protocol buffer compiler.
// Source: chat/chat.proto
//
// For information on using the generated types, please see the documentation:
//   https://github.com/apple/swift-protobuf/

import Foundation
import SwiftProtobuf

// If the compiler emits an error on this type, it is because this file
// was generated by a version of the `protoc` Swift plug-in that is
// incompatible with the version of SwiftProtobuf to which you are linking.
// Please ensure that you are building against the same version of the API
// that was used to generate this file.
fileprivate struct _GeneratedWithProtocGenSwiftVersion: SwiftProtobuf.ProtobufAPIVersionCheck {
  struct _2: SwiftProtobuf.ProtobufAPIVersion_2 {}
  typealias Version = _2
}

public struct Chat_ReadMessagesRequest {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  public var channelID: String = String()

  public var lastMessageID: String = String()

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public init() {}
}

public struct Chat_ReadMessagesResponse {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  public var messageID: String = String()

  public var content: String = String()

  public var authorID: String = String()

  public var authorUsername: String = String()

  public var authorAvatar: String = String()

  public var createdAt: String = String()

  public var channelID: String = String()

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public init() {}
}

public struct Chat_WriteMessageRequest {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  public var channelID: String = String()

  public var content: String = String()

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public init() {}
}

public struct Chat_WriteMessageResponse {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  public var messageID: String = String()

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public init() {}
}

#if swift(>=5.5) && canImport(_Concurrency)
extension Chat_ReadMessagesRequest: @unchecked Sendable {}
extension Chat_ReadMessagesResponse: @unchecked Sendable {}
extension Chat_WriteMessageRequest: @unchecked Sendable {}
extension Chat_WriteMessageResponse: @unchecked Sendable {}
#endif  // swift(>=5.5) && canImport(_Concurrency)

// MARK: - Code below here is support for the SwiftProtobuf runtime.

fileprivate let _protobuf_package = "chat"

extension Chat_ReadMessagesRequest: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = _protobuf_package + ".ReadMessagesRequest"
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    1: .same(proto: "channelID"),
    2: .same(proto: "lastMessageID"),
  ]

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    while let fieldNumber = try decoder.nextFieldNumber() {
      // The use of inline closures is to circumvent an issue where the compiler
      // allocates stack space for every case branch when no optimizations are
      // enabled. https://github.com/apple/swift-protobuf/issues/1034
      switch fieldNumber {
      case 1: try { try decoder.decodeSingularStringField(value: &self.channelID) }()
      case 2: try { try decoder.decodeSingularStringField(value: &self.lastMessageID) }()
      default: break
      }
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    if !self.channelID.isEmpty {
      try visitor.visitSingularStringField(value: self.channelID, fieldNumber: 1)
    }
    if !self.lastMessageID.isEmpty {
      try visitor.visitSingularStringField(value: self.lastMessageID, fieldNumber: 2)
    }
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: Chat_ReadMessagesRequest, rhs: Chat_ReadMessagesRequest) -> Bool {
    if lhs.channelID != rhs.channelID {return false}
    if lhs.lastMessageID != rhs.lastMessageID {return false}
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}

extension Chat_ReadMessagesResponse: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = _protobuf_package + ".ReadMessagesResponse"
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    1: .same(proto: "messageID"),
    2: .same(proto: "content"),
    3: .same(proto: "authorID"),
    4: .same(proto: "authorUsername"),
    5: .same(proto: "authorAvatar"),
    6: .same(proto: "createdAt"),
    7: .same(proto: "channelID"),
  ]

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    while let fieldNumber = try decoder.nextFieldNumber() {
      // The use of inline closures is to circumvent an issue where the compiler
      // allocates stack space for every case branch when no optimizations are
      // enabled. https://github.com/apple/swift-protobuf/issues/1034
      switch fieldNumber {
      case 1: try { try decoder.decodeSingularStringField(value: &self.messageID) }()
      case 2: try { try decoder.decodeSingularStringField(value: &self.content) }()
      case 3: try { try decoder.decodeSingularStringField(value: &self.authorID) }()
      case 4: try { try decoder.decodeSingularStringField(value: &self.authorUsername) }()
      case 5: try { try decoder.decodeSingularStringField(value: &self.authorAvatar) }()
      case 6: try { try decoder.decodeSingularStringField(value: &self.createdAt) }()
      case 7: try { try decoder.decodeSingularStringField(value: &self.channelID) }()
      default: break
      }
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    if !self.messageID.isEmpty {
      try visitor.visitSingularStringField(value: self.messageID, fieldNumber: 1)
    }
    if !self.content.isEmpty {
      try visitor.visitSingularStringField(value: self.content, fieldNumber: 2)
    }
    if !self.authorID.isEmpty {
      try visitor.visitSingularStringField(value: self.authorID, fieldNumber: 3)
    }
    if !self.authorUsername.isEmpty {
      try visitor.visitSingularStringField(value: self.authorUsername, fieldNumber: 4)
    }
    if !self.authorAvatar.isEmpty {
      try visitor.visitSingularStringField(value: self.authorAvatar, fieldNumber: 5)
    }
    if !self.createdAt.isEmpty {
      try visitor.visitSingularStringField(value: self.createdAt, fieldNumber: 6)
    }
    if !self.channelID.isEmpty {
      try visitor.visitSingularStringField(value: self.channelID, fieldNumber: 7)
    }
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: Chat_ReadMessagesResponse, rhs: Chat_ReadMessagesResponse) -> Bool {
    if lhs.messageID != rhs.messageID {return false}
    if lhs.content != rhs.content {return false}
    if lhs.authorID != rhs.authorID {return false}
    if lhs.authorUsername != rhs.authorUsername {return false}
    if lhs.authorAvatar != rhs.authorAvatar {return false}
    if lhs.createdAt != rhs.createdAt {return false}
    if lhs.channelID != rhs.channelID {return false}
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}

extension Chat_WriteMessageRequest: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = _protobuf_package + ".WriteMessageRequest"
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    1: .same(proto: "channelID"),
    2: .same(proto: "content"),
  ]

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    while let fieldNumber = try decoder.nextFieldNumber() {
      // The use of inline closures is to circumvent an issue where the compiler
      // allocates stack space for every case branch when no optimizations are
      // enabled. https://github.com/apple/swift-protobuf/issues/1034
      switch fieldNumber {
      case 1: try { try decoder.decodeSingularStringField(value: &self.channelID) }()
      case 2: try { try decoder.decodeSingularStringField(value: &self.content) }()
      default: break
      }
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    if !self.channelID.isEmpty {
      try visitor.visitSingularStringField(value: self.channelID, fieldNumber: 1)
    }
    if !self.content.isEmpty {
      try visitor.visitSingularStringField(value: self.content, fieldNumber: 2)
    }
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: Chat_WriteMessageRequest, rhs: Chat_WriteMessageRequest) -> Bool {
    if lhs.channelID != rhs.channelID {return false}
    if lhs.content != rhs.content {return false}
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}

extension Chat_WriteMessageResponse: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = _protobuf_package + ".WriteMessageResponse"
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    1: .same(proto: "messageID"),
  ]

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    while let fieldNumber = try decoder.nextFieldNumber() {
      // The use of inline closures is to circumvent an issue where the compiler
      // allocates stack space for every case branch when no optimizations are
      // enabled. https://github.com/apple/swift-protobuf/issues/1034
      switch fieldNumber {
      case 1: try { try decoder.decodeSingularStringField(value: &self.messageID) }()
      default: break
      }
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    if !self.messageID.isEmpty {
      try visitor.visitSingularStringField(value: self.messageID, fieldNumber: 1)
    }
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: Chat_WriteMessageResponse, rhs: Chat_WriteMessageResponse) -> Bool {
    if lhs.messageID != rhs.messageID {return false}
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}