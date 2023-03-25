from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

BERT: Summarizer
DESCRIPTOR: _descriptor.FileDescriptor
LANGCHAIN: Summarizer

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

class Summarizer(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = []
