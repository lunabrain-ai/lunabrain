from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class SummarizeRequest(_message.Message):
    __slots__ = ["content"]
    CONTENT_FIELD_NUMBER: _ClassVar[int]
    content: str
    def __init__(self, content: _Optional[str] = ...) -> None: ...

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
