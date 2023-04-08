// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.1
// 	protoc        v3.20.3
// source: python.proto

package python

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type IndexType int32

const (
	IndexType_LLAMA IndexType = 0
	IndexType_FAISS IndexType = 1
	IndexType_BM25  IndexType = 2
)

// Enum value maps for IndexType.
var (
	IndexType_name = map[int32]string{
		0: "LLAMA",
		1: "FAISS",
		2: "BM25",
	}
	IndexType_value = map[string]int32{
		"LLAMA": 0,
		"FAISS": 1,
		"BM25":  2,
	}
)

func (x IndexType) Enum() *IndexType {
	p := new(IndexType)
	*p = x
	return p
}

func (x IndexType) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (IndexType) Descriptor() protoreflect.EnumDescriptor {
	return file_python_proto_enumTypes[0].Descriptor()
}

func (IndexType) Type() protoreflect.EnumType {
	return &file_python_proto_enumTypes[0]
}

func (x IndexType) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use IndexType.Descriptor instead.
func (IndexType) EnumDescriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{0}
}

type Summarizer int32

const (
	Summarizer_LANGCHAIN Summarizer = 0
	Summarizer_BERT      Summarizer = 1
)

// Enum value maps for Summarizer.
var (
	Summarizer_name = map[int32]string{
		0: "LANGCHAIN",
		1: "BERT",
	}
	Summarizer_value = map[string]int32{
		"LANGCHAIN": 0,
		"BERT":      1,
	}
)

func (x Summarizer) Enum() *Summarizer {
	p := new(Summarizer)
	*p = x
	return p
}

func (x Summarizer) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (Summarizer) Descriptor() protoreflect.EnumDescriptor {
	return file_python_proto_enumTypes[1].Descriptor()
}

func (Summarizer) Type() protoreflect.EnumType {
	return &file_python_proto_enumTypes[1]
}

func (x Summarizer) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use Summarizer.Descriptor instead.
func (Summarizer) EnumDescriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{1}
}

type Query struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Index string    `protobuf:"bytes,1,opt,name=index,proto3" json:"index,omitempty"`
	Query string    `protobuf:"bytes,2,opt,name=query,proto3" json:"query,omitempty"`
	Type  IndexType `protobuf:"varint,3,opt,name=type,proto3,enum=python.IndexType" json:"type,omitempty"`
}

func (x *Query) Reset() {
	*x = Query{}
	if protoimpl.UnsafeEnabled {
		mi := &file_python_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Query) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Query) ProtoMessage() {}

func (x *Query) ProtoReflect() protoreflect.Message {
	mi := &file_python_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Query.ProtoReflect.Descriptor instead.
func (*Query) Descriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{0}
}

func (x *Query) GetIndex() string {
	if x != nil {
		return x.Index
	}
	return ""
}

func (x *Query) GetQuery() string {
	if x != nil {
		return x.Query
	}
	return ""
}

func (x *Query) GetType() IndexType {
	if x != nil {
		return x.Type
	}
	return IndexType_LLAMA
}

type QueryResult struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Results []string `protobuf:"bytes,1,rep,name=results,proto3" json:"results,omitempty"`
}

func (x *QueryResult) Reset() {
	*x = QueryResult{}
	if protoimpl.UnsafeEnabled {
		mi := &file_python_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *QueryResult) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*QueryResult) ProtoMessage() {}

func (x *QueryResult) ProtoReflect() protoreflect.Message {
	mi := &file_python_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use QueryResult.ProtoReflect.Descriptor instead.
func (*QueryResult) Descriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{1}
}

func (x *QueryResult) GetResults() []string {
	if x != nil {
		return x.Results
	}
	return nil
}

type IndexDirectoryRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Path string    `protobuf:"bytes,1,opt,name=path,proto3" json:"path,omitempty"`
	Type IndexType `protobuf:"varint,2,opt,name=type,proto3,enum=python.IndexType" json:"type,omitempty"`
}

func (x *IndexDirectoryRequest) Reset() {
	*x = IndexDirectoryRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_python_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *IndexDirectoryRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*IndexDirectoryRequest) ProtoMessage() {}

func (x *IndexDirectoryRequest) ProtoReflect() protoreflect.Message {
	mi := &file_python_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use IndexDirectoryRequest.ProtoReflect.Descriptor instead.
func (*IndexDirectoryRequest) Descriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{2}
}

func (x *IndexDirectoryRequest) GetPath() string {
	if x != nil {
		return x.Path
	}
	return ""
}

func (x *IndexDirectoryRequest) GetType() IndexType {
	if x != nil {
		return x.Type
	}
	return IndexType_LLAMA
}

type Index struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Id   string    `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Type IndexType `protobuf:"varint,2,opt,name=type,proto3,enum=python.IndexType" json:"type,omitempty"`
}

func (x *Index) Reset() {
	*x = Index{}
	if protoimpl.UnsafeEnabled {
		mi := &file_python_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Index) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Index) ProtoMessage() {}

func (x *Index) ProtoReflect() protoreflect.Message {
	mi := &file_python_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Index.ProtoReflect.Descriptor instead.
func (*Index) Descriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{3}
}

func (x *Index) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *Index) GetType() IndexType {
	if x != nil {
		return x.Type
	}
	return IndexType_LLAMA
}

type Text struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Text string `protobuf:"bytes,1,opt,name=text,proto3" json:"text,omitempty"`
}

func (x *Text) Reset() {
	*x = Text{}
	if protoimpl.UnsafeEnabled {
		mi := &file_python_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Text) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Text) ProtoMessage() {}

func (x *Text) ProtoReflect() protoreflect.Message {
	mi := &file_python_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Text.ProtoReflect.Descriptor instead.
func (*Text) Descriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{4}
}

func (x *Text) GetText() string {
	if x != nil {
		return x.Text
	}
	return ""
}

type Categories struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Categories []string `protobuf:"bytes,1,rep,name=categories,proto3" json:"categories,omitempty"`
}

func (x *Categories) Reset() {
	*x = Categories{}
	if protoimpl.UnsafeEnabled {
		mi := &file_python_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Categories) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Categories) ProtoMessage() {}

func (x *Categories) ProtoReflect() protoreflect.Message {
	mi := &file_python_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Categories.ProtoReflect.Descriptor instead.
func (*Categories) Descriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{5}
}

func (x *Categories) GetCategories() []string {
	if x != nil {
		return x.Categories
	}
	return nil
}

type SummarizeRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Content    string     `protobuf:"bytes,1,opt,name=content,proto3" json:"content,omitempty"`
	Summarizer Summarizer `protobuf:"varint,2,opt,name=summarizer,proto3,enum=python.Summarizer" json:"summarizer,omitempty"`
}

func (x *SummarizeRequest) Reset() {
	*x = SummarizeRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_python_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *SummarizeRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*SummarizeRequest) ProtoMessage() {}

func (x *SummarizeRequest) ProtoReflect() protoreflect.Message {
	mi := &file_python_proto_msgTypes[6]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use SummarizeRequest.ProtoReflect.Descriptor instead.
func (*SummarizeRequest) Descriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{6}
}

func (x *SummarizeRequest) GetContent() string {
	if x != nil {
		return x.Content
	}
	return ""
}

func (x *SummarizeRequest) GetSummarizer() Summarizer {
	if x != nil {
		return x.Summarizer
	}
	return Summarizer_LANGCHAIN
}

type SummarizeResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Summary string `protobuf:"bytes,1,opt,name=summary,proto3" json:"summary,omitempty"`
}

func (x *SummarizeResponse) Reset() {
	*x = SummarizeResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_python_proto_msgTypes[7]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *SummarizeResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*SummarizeResponse) ProtoMessage() {}

func (x *SummarizeResponse) ProtoReflect() protoreflect.Message {
	mi := &file_python_proto_msgTypes[7]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use SummarizeResponse.ProtoReflect.Descriptor instead.
func (*SummarizeResponse) Descriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{7}
}

func (x *SummarizeResponse) GetSummary() string {
	if x != nil {
		return x.Summary
	}
	return ""
}

type TranscribeRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	File string `protobuf:"bytes,1,opt,name=file,proto3" json:"file,omitempty"`
}

func (x *TranscribeRequest) Reset() {
	*x = TranscribeRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_python_proto_msgTypes[8]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *TranscribeRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*TranscribeRequest) ProtoMessage() {}

func (x *TranscribeRequest) ProtoReflect() protoreflect.Message {
	mi := &file_python_proto_msgTypes[8]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use TranscribeRequest.ProtoReflect.Descriptor instead.
func (*TranscribeRequest) Descriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{8}
}

func (x *TranscribeRequest) GetFile() string {
	if x != nil {
		return x.File
	}
	return ""
}

type TranscribeResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Transcription string `protobuf:"bytes,1,opt,name=transcription,proto3" json:"transcription,omitempty"`
}

func (x *TranscribeResponse) Reset() {
	*x = TranscribeResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_python_proto_msgTypes[9]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *TranscribeResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*TranscribeResponse) ProtoMessage() {}

func (x *TranscribeResponse) ProtoReflect() protoreflect.Message {
	mi := &file_python_proto_msgTypes[9]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use TranscribeResponse.ProtoReflect.Descriptor instead.
func (*TranscribeResponse) Descriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{9}
}

func (x *TranscribeResponse) GetTranscription() string {
	if x != nil {
		return x.Transcription
	}
	return ""
}

type Video struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Id string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
}

func (x *Video) Reset() {
	*x = Video{}
	if protoimpl.UnsafeEnabled {
		mi := &file_python_proto_msgTypes[10]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Video) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Video) ProtoMessage() {}

func (x *Video) ProtoReflect() protoreflect.Message {
	mi := &file_python_proto_msgTypes[10]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Video.ProtoReflect.Descriptor instead.
func (*Video) Descriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{10}
}

func (x *Video) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

type TranscriptSection struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Text     string  `protobuf:"bytes,1,opt,name=text,proto3" json:"text,omitempty"`
	Start    float32 `protobuf:"fixed32,2,opt,name=start,proto3" json:"start,omitempty"`
	Duration float32 `protobuf:"fixed32,3,opt,name=duration,proto3" json:"duration,omitempty"`
}

func (x *TranscriptSection) Reset() {
	*x = TranscriptSection{}
	if protoimpl.UnsafeEnabled {
		mi := &file_python_proto_msgTypes[11]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *TranscriptSection) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*TranscriptSection) ProtoMessage() {}

func (x *TranscriptSection) ProtoReflect() protoreflect.Message {
	mi := &file_python_proto_msgTypes[11]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use TranscriptSection.ProtoReflect.Descriptor instead.
func (*TranscriptSection) Descriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{11}
}

func (x *TranscriptSection) GetText() string {
	if x != nil {
		return x.Text
	}
	return ""
}

func (x *TranscriptSection) GetStart() float32 {
	if x != nil {
		return x.Start
	}
	return 0
}

func (x *TranscriptSection) GetDuration() float32 {
	if x != nil {
		return x.Duration
	}
	return 0
}

type Transcript struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Transcript []*TranscriptSection `protobuf:"bytes,1,rep,name=transcript,proto3" json:"transcript,omitempty"`
}

func (x *Transcript) Reset() {
	*x = Transcript{}
	if protoimpl.UnsafeEnabled {
		mi := &file_python_proto_msgTypes[12]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Transcript) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Transcript) ProtoMessage() {}

func (x *Transcript) ProtoReflect() protoreflect.Message {
	mi := &file_python_proto_msgTypes[12]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Transcript.ProtoReflect.Descriptor instead.
func (*Transcript) Descriptor() ([]byte, []int) {
	return file_python_proto_rawDescGZIP(), []int{12}
}

func (x *Transcript) GetTranscript() []*TranscriptSection {
	if x != nil {
		return x.Transcript
	}
	return nil
}

var File_python_proto protoreflect.FileDescriptor

var file_python_proto_rawDesc = []byte{
	0x0a, 0x0c, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x06,
	0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x22, 0x5a, 0x0a, 0x05, 0x51, 0x75, 0x65, 0x72, 0x79, 0x12,
	0x14, 0x0a, 0x05, 0x69, 0x6e, 0x64, 0x65, 0x78, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x05,
	0x69, 0x6e, 0x64, 0x65, 0x78, 0x12, 0x14, 0x0a, 0x05, 0x71, 0x75, 0x65, 0x72, 0x79, 0x18, 0x02,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x71, 0x75, 0x65, 0x72, 0x79, 0x12, 0x25, 0x0a, 0x04, 0x74,
	0x79, 0x70, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x11, 0x2e, 0x70, 0x79, 0x74, 0x68,
	0x6f, 0x6e, 0x2e, 0x49, 0x6e, 0x64, 0x65, 0x78, 0x54, 0x79, 0x70, 0x65, 0x52, 0x04, 0x74, 0x79,
	0x70, 0x65, 0x22, 0x27, 0x0a, 0x0b, 0x51, 0x75, 0x65, 0x72, 0x79, 0x52, 0x65, 0x73, 0x75, 0x6c,
	0x74, 0x12, 0x18, 0x0a, 0x07, 0x72, 0x65, 0x73, 0x75, 0x6c, 0x74, 0x73, 0x18, 0x01, 0x20, 0x03,
	0x28, 0x09, 0x52, 0x07, 0x72, 0x65, 0x73, 0x75, 0x6c, 0x74, 0x73, 0x22, 0x52, 0x0a, 0x15, 0x49,
	0x6e, 0x64, 0x65, 0x78, 0x44, 0x69, 0x72, 0x65, 0x63, 0x74, 0x6f, 0x72, 0x79, 0x52, 0x65, 0x71,
	0x75, 0x65, 0x73, 0x74, 0x12, 0x12, 0x0a, 0x04, 0x70, 0x61, 0x74, 0x68, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x04, 0x70, 0x61, 0x74, 0x68, 0x12, 0x25, 0x0a, 0x04, 0x74, 0x79, 0x70, 0x65,
	0x18, 0x02, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x11, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x2e,
	0x49, 0x6e, 0x64, 0x65, 0x78, 0x54, 0x79, 0x70, 0x65, 0x52, 0x04, 0x74, 0x79, 0x70, 0x65, 0x22,
	0x3e, 0x0a, 0x05, 0x49, 0x6e, 0x64, 0x65, 0x78, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x12, 0x25, 0x0a, 0x04, 0x74, 0x79, 0x70, 0x65,
	0x18, 0x02, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x11, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x2e,
	0x49, 0x6e, 0x64, 0x65, 0x78, 0x54, 0x79, 0x70, 0x65, 0x52, 0x04, 0x74, 0x79, 0x70, 0x65, 0x22,
	0x1a, 0x0a, 0x04, 0x54, 0x65, 0x78, 0x74, 0x12, 0x12, 0x0a, 0x04, 0x74, 0x65, 0x78, 0x74, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x74, 0x65, 0x78, 0x74, 0x22, 0x2c, 0x0a, 0x0a, 0x43,
	0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x69, 0x65, 0x73, 0x12, 0x1e, 0x0a, 0x0a, 0x63, 0x61, 0x74,
	0x65, 0x67, 0x6f, 0x72, 0x69, 0x65, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x09, 0x52, 0x0a, 0x63,
	0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x69, 0x65, 0x73, 0x22, 0x60, 0x0a, 0x10, 0x53, 0x75, 0x6d,
	0x6d, 0x61, 0x72, 0x69, 0x7a, 0x65, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x18, 0x0a,
	0x07, 0x63, 0x6f, 0x6e, 0x74, 0x65, 0x6e, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07,
	0x63, 0x6f, 0x6e, 0x74, 0x65, 0x6e, 0x74, 0x12, 0x32, 0x0a, 0x0a, 0x73, 0x75, 0x6d, 0x6d, 0x61,
	0x72, 0x69, 0x7a, 0x65, 0x72, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x12, 0x2e, 0x70, 0x79,
	0x74, 0x68, 0x6f, 0x6e, 0x2e, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x69, 0x7a, 0x65, 0x72, 0x52,
	0x0a, 0x73, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x69, 0x7a, 0x65, 0x72, 0x22, 0x2d, 0x0a, 0x11, 0x53,
	0x75, 0x6d, 0x6d, 0x61, 0x72, 0x69, 0x7a, 0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65,
	0x12, 0x18, 0x0a, 0x07, 0x73, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x18, 0x01, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x07, 0x73, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x79, 0x22, 0x27, 0x0a, 0x11, 0x54, 0x72,
	0x61, 0x6e, 0x73, 0x63, 0x72, 0x69, 0x62, 0x65, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12,
	0x12, 0x0a, 0x04, 0x66, 0x69, 0x6c, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x66,
	0x69, 0x6c, 0x65, 0x22, 0x3a, 0x0a, 0x12, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x63, 0x72, 0x69, 0x62,
	0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x24, 0x0a, 0x0d, 0x74, 0x72, 0x61,
	0x6e, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x69, 0x6f, 0x6e, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x0d, 0x74, 0x72, 0x61, 0x6e, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x69, 0x6f, 0x6e, 0x22,
	0x17, 0x0a, 0x05, 0x56, 0x69, 0x64, 0x65, 0x6f, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x22, 0x59, 0x0a, 0x11, 0x54, 0x72, 0x61, 0x6e,
	0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x53, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x12, 0x12, 0x0a,
	0x04, 0x74, 0x65, 0x78, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x74, 0x65, 0x78,
	0x74, 0x12, 0x14, 0x0a, 0x05, 0x73, 0x74, 0x61, 0x72, 0x74, 0x18, 0x02, 0x20, 0x01, 0x28, 0x02,
	0x52, 0x05, 0x73, 0x74, 0x61, 0x72, 0x74, 0x12, 0x1a, 0x0a, 0x08, 0x64, 0x75, 0x72, 0x61, 0x74,
	0x69, 0x6f, 0x6e, 0x18, 0x03, 0x20, 0x01, 0x28, 0x02, 0x52, 0x08, 0x64, 0x75, 0x72, 0x61, 0x74,
	0x69, 0x6f, 0x6e, 0x22, 0x47, 0x0a, 0x0a, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x63, 0x72, 0x69, 0x70,
	0x74, 0x12, 0x39, 0x0a, 0x0a, 0x74, 0x72, 0x61, 0x6e, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x18,
	0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x19, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x2e, 0x54,
	0x72, 0x61, 0x6e, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x53, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e,
	0x52, 0x0a, 0x74, 0x72, 0x61, 0x6e, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x2a, 0x2b, 0x0a, 0x09,
	0x49, 0x6e, 0x64, 0x65, 0x78, 0x54, 0x79, 0x70, 0x65, 0x12, 0x09, 0x0a, 0x05, 0x4c, 0x4c, 0x41,
	0x4d, 0x41, 0x10, 0x00, 0x12, 0x09, 0x0a, 0x05, 0x46, 0x41, 0x49, 0x53, 0x53, 0x10, 0x01, 0x12,
	0x08, 0x0a, 0x04, 0x42, 0x4d, 0x32, 0x35, 0x10, 0x02, 0x2a, 0x25, 0x0a, 0x0a, 0x53, 0x75, 0x6d,
	0x6d, 0x61, 0x72, 0x69, 0x7a, 0x65, 0x72, 0x12, 0x0d, 0x0a, 0x09, 0x4c, 0x41, 0x4e, 0x47, 0x43,
	0x48, 0x41, 0x49, 0x4e, 0x10, 0x00, 0x12, 0x08, 0x0a, 0x04, 0x42, 0x45, 0x52, 0x54, 0x10, 0x01,
	0x32, 0x92, 0x03, 0x0a, 0x06, 0x50, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x12, 0x43, 0x0a, 0x0a, 0x54,
	0x72, 0x61, 0x6e, 0x73, 0x63, 0x72, 0x69, 0x62, 0x65, 0x12, 0x19, 0x2e, 0x70, 0x79, 0x74, 0x68,
	0x6f, 0x6e, 0x2e, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x63, 0x72, 0x69, 0x62, 0x65, 0x52, 0x65, 0x71,
	0x75, 0x65, 0x73, 0x74, 0x1a, 0x1a, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x2e, 0x54, 0x72,
	0x61, 0x6e, 0x73, 0x63, 0x72, 0x69, 0x62, 0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65,
	0x12, 0x40, 0x0a, 0x09, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x69, 0x7a, 0x65, 0x12, 0x18, 0x2e,
	0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x2e, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x69, 0x7a, 0x65,
	0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x19, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e,
	0x2e, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x69, 0x7a, 0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e,
	0x73, 0x65, 0x12, 0x36, 0x0a, 0x11, 0x59, 0x6f, 0x75, 0x74, 0x75, 0x62, 0x65, 0x54, 0x72, 0x61,
	0x6e, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x12, 0x0d, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e,
	0x2e, 0x56, 0x69, 0x64, 0x65, 0x6f, 0x1a, 0x12, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x2e,
	0x54, 0x72, 0x61, 0x6e, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x12, 0x27, 0x0a, 0x09, 0x4e, 0x6f,
	0x72, 0x6d, 0x61, 0x6c, 0x69, 0x7a, 0x65, 0x12, 0x0c, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e,
	0x2e, 0x54, 0x65, 0x78, 0x74, 0x1a, 0x0c, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x2e, 0x54,
	0x65, 0x78, 0x74, 0x12, 0x2e, 0x0a, 0x0a, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x69, 0x7a,
	0x65, 0x12, 0x0c, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x2e, 0x54, 0x65, 0x78, 0x74, 0x1a,
	0x12, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x2e, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72,
	0x69, 0x65, 0x73, 0x12, 0x3e, 0x0a, 0x0e, 0x49, 0x6e, 0x64, 0x65, 0x78, 0x44, 0x69, 0x72, 0x65,
	0x63, 0x74, 0x6f, 0x72, 0x79, 0x12, 0x1d, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x2e, 0x49,
	0x6e, 0x64, 0x65, 0x78, 0x44, 0x69, 0x72, 0x65, 0x63, 0x74, 0x6f, 0x72, 0x79, 0x52, 0x65, 0x71,
	0x75, 0x65, 0x73, 0x74, 0x1a, 0x0d, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x2e, 0x49, 0x6e,
	0x64, 0x65, 0x78, 0x12, 0x30, 0x0a, 0x0a, 0x51, 0x75, 0x65, 0x72, 0x79, 0x49, 0x6e, 0x64, 0x65,
	0x78, 0x12, 0x0d, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x2e, 0x51, 0x75, 0x65, 0x72, 0x79,
	0x1a, 0x13, 0x2e, 0x70, 0x79, 0x74, 0x68, 0x6f, 0x6e, 0x2e, 0x51, 0x75, 0x65, 0x72, 0x79, 0x52,
	0x65, 0x73, 0x75, 0x6c, 0x74, 0x42, 0x0e, 0x5a, 0x0c, 0x2e, 0x2f, 0x67, 0x65, 0x6e, 0x2f, 0x70,
	0x79, 0x74, 0x68, 0x6f, 0x6e, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_python_proto_rawDescOnce sync.Once
	file_python_proto_rawDescData = file_python_proto_rawDesc
)

func file_python_proto_rawDescGZIP() []byte {
	file_python_proto_rawDescOnce.Do(func() {
		file_python_proto_rawDescData = protoimpl.X.CompressGZIP(file_python_proto_rawDescData)
	})
	return file_python_proto_rawDescData
}

var file_python_proto_enumTypes = make([]protoimpl.EnumInfo, 2)
var file_python_proto_msgTypes = make([]protoimpl.MessageInfo, 13)
var file_python_proto_goTypes = []interface{}{
	(IndexType)(0),                // 0: python.IndexType
	(Summarizer)(0),               // 1: python.Summarizer
	(*Query)(nil),                 // 2: python.Query
	(*QueryResult)(nil),           // 3: python.QueryResult
	(*IndexDirectoryRequest)(nil), // 4: python.IndexDirectoryRequest
	(*Index)(nil),                 // 5: python.Index
	(*Text)(nil),                  // 6: python.Text
	(*Categories)(nil),            // 7: python.Categories
	(*SummarizeRequest)(nil),      // 8: python.SummarizeRequest
	(*SummarizeResponse)(nil),     // 9: python.SummarizeResponse
	(*TranscribeRequest)(nil),     // 10: python.TranscribeRequest
	(*TranscribeResponse)(nil),    // 11: python.TranscribeResponse
	(*Video)(nil),                 // 12: python.Video
	(*TranscriptSection)(nil),     // 13: python.TranscriptSection
	(*Transcript)(nil),            // 14: python.Transcript
}
var file_python_proto_depIdxs = []int32{
	0,  // 0: python.Query.type:type_name -> python.IndexType
	0,  // 1: python.IndexDirectoryRequest.type:type_name -> python.IndexType
	0,  // 2: python.Index.type:type_name -> python.IndexType
	1,  // 3: python.SummarizeRequest.summarizer:type_name -> python.Summarizer
	13, // 4: python.Transcript.transcript:type_name -> python.TranscriptSection
	10, // 5: python.Python.Transcribe:input_type -> python.TranscribeRequest
	8,  // 6: python.Python.Summarize:input_type -> python.SummarizeRequest
	12, // 7: python.Python.YoutubeTranscript:input_type -> python.Video
	6,  // 8: python.Python.Normalize:input_type -> python.Text
	6,  // 9: python.Python.Categorize:input_type -> python.Text
	4,  // 10: python.Python.IndexDirectory:input_type -> python.IndexDirectoryRequest
	2,  // 11: python.Python.QueryIndex:input_type -> python.Query
	11, // 12: python.Python.Transcribe:output_type -> python.TranscribeResponse
	9,  // 13: python.Python.Summarize:output_type -> python.SummarizeResponse
	14, // 14: python.Python.YoutubeTranscript:output_type -> python.Transcript
	6,  // 15: python.Python.Normalize:output_type -> python.Text
	7,  // 16: python.Python.Categorize:output_type -> python.Categories
	5,  // 17: python.Python.IndexDirectory:output_type -> python.Index
	3,  // 18: python.Python.QueryIndex:output_type -> python.QueryResult
	12, // [12:19] is the sub-list for method output_type
	5,  // [5:12] is the sub-list for method input_type
	5,  // [5:5] is the sub-list for extension type_name
	5,  // [5:5] is the sub-list for extension extendee
	0,  // [0:5] is the sub-list for field type_name
}

func init() { file_python_proto_init() }
func file_python_proto_init() {
	if File_python_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_python_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Query); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_python_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*QueryResult); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_python_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*IndexDirectoryRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_python_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Index); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_python_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Text); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_python_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Categories); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_python_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*SummarizeRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_python_proto_msgTypes[7].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*SummarizeResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_python_proto_msgTypes[8].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*TranscribeRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_python_proto_msgTypes[9].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*TranscribeResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_python_proto_msgTypes[10].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Video); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_python_proto_msgTypes[11].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*TranscriptSection); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_python_proto_msgTypes[12].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Transcript); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_python_proto_rawDesc,
			NumEnums:      2,
			NumMessages:   13,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_python_proto_goTypes,
		DependencyIndexes: file_python_proto_depIdxs,
		EnumInfos:         file_python_proto_enumTypes,
		MessageInfos:      file_python_proto_msgTypes,
	}.Build()
	File_python_proto = out.File
	file_python_proto_rawDesc = nil
	file_python_proto_goTypes = nil
	file_python_proto_depIdxs = nil
}
