from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

BERT: Summarizer
BM25: IndexType
DESCRIPTOR: _descriptor.FileDescriptor
FAISS: IndexType
KEYBERT: Categorizer
LANGCHAIN: Summarizer
LLAMA: IndexType
T5_TAG: Categorizer

class Categories(_message.Message):
    __slots__ = ["categories"]
    CATEGORIES_FIELD_NUMBER: _ClassVar[int]
    categories: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, categories: _Optional[_Iterable[str]] = ...) -> None: ...

class CategorizeRequest(_message.Message):
    __slots__ = ["categorizer", "text"]
    CATEGORIZER_FIELD_NUMBER: _ClassVar[int]
    TEXT_FIELD_NUMBER: _ClassVar[int]
    categorizer: Categorizer
    text: str
    def __init__(self, text: _Optional[str] = ..., categorizer: _Optional[_Union[Categorizer, str]] = ...) -> None: ...

class Index(_message.Message):
    __slots__ = ["id", "type"]
    ID_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    id: str
    type: IndexType
    def __init__(self, id: _Optional[str] = ..., type: _Optional[_Union[IndexType, str]] = ...) -> None: ...

class IndexDirectoryRequest(_message.Message):
    __slots__ = ["path", "type"]
    PATH_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    path: str
    type: IndexType
    def __init__(self, path: _Optional[str] = ..., type: _Optional[_Union[IndexType, str]] = ...) -> None: ...

class IndexQuery(_message.Message):
    __slots__ = ["index", "query"]
    INDEX_FIELD_NUMBER: _ClassVar[int]
    QUERY_FIELD_NUMBER: _ClassVar[int]
    index: str
    query: str
    def __init__(self, index: _Optional[str] = ..., query: _Optional[str] = ...) -> None: ...

class QueryResult(_message.Message):
    __slots__ = ["results"]
    RESULTS_FIELD_NUMBER: _ClassVar[int]
    results: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, results: _Optional[_Iterable[str]] = ...) -> None: ...

class SummarizeRequest(_message.Message):
    __slots__ = ["content", "summarizer"]
    CONTENT_FIELD_NUMBER: _ClassVar[int]
    SUMMARIZER_FIELD_NUMBER: _ClassVar[int]
    content: str
    summarizer: Summarizer
    def __init__(self, content: _Optional[str] = ..., summarizer: _Optional[_Union[Summarizer, str]] = ...) -> None: ...

class SummarizeResponse(_message.Message):
    __slots__ = ["summary"]
    SUMMARY_FIELD_NUMBER: _ClassVar[int]
    summary: str
    def __init__(self, summary: _Optional[str] = ...) -> None: ...

class Text(_message.Message):
    __slots__ = ["text"]
    TEXT_FIELD_NUMBER: _ClassVar[int]
    text: str
    def __init__(self, text: _Optional[str] = ...) -> None: ...

class TranscribeRequest(_message.Message):
    __slots__ = ["file"]
    FILE_FIELD_NUMBER: _ClassVar[int]
    file: str
    def __init__(self, file: _Optional[str] = ...) -> None: ...

class TranscribeResponse(_message.Message):
    __slots__ = ["transcription"]
    TRANSCRIPTION_FIELD_NUMBER: _ClassVar[int]
    transcription: str
    def __init__(self, transcription: _Optional[str] = ...) -> None: ...

class Transcript(_message.Message):
    __slots__ = ["transcript"]
    TRANSCRIPT_FIELD_NUMBER: _ClassVar[int]
    transcript: _containers.RepeatedCompositeFieldContainer[TranscriptSection]
    def __init__(self, transcript: _Optional[_Iterable[_Union[TranscriptSection, _Mapping]]] = ...) -> None: ...

class TranscriptSection(_message.Message):
    __slots__ = ["duration", "start", "text"]
    DURATION_FIELD_NUMBER: _ClassVar[int]
    START_FIELD_NUMBER: _ClassVar[int]
    TEXT_FIELD_NUMBER: _ClassVar[int]
    duration: float
    start: float
    text: str
    def __init__(self, text: _Optional[str] = ..., start: _Optional[float] = ..., duration: _Optional[float] = ...) -> None: ...

class Video(_message.Message):
    __slots__ = ["id"]
    ID_FIELD_NUMBER: _ClassVar[int]
    id: str
    def __init__(self, id: _Optional[str] = ...) -> None: ...

class IndexType(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = []

class Categorizer(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = []

class Summarizer(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = []
