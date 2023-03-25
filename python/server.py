from concurrent import futures

import summarizer

import python_pb2
from python_pb2_grpc import PythonServicer
import python_pb2_grpc

from langchain.chains.summarize import load_summarize_chain
from langchain.llms import OpenAI
from langchain.docstore.document import Document
import grpc
import whisper
from youtube_transcript_api import YouTubeTranscriptApi

llm = OpenAI(temperature=0.9)

model = whisper.load_model("base")


class PythonSerivce(PythonServicer):
    def Transcribe(self, req: python_pb2.TranscribeRequest, context):
        result = model.transcribe(req.file)
        return python_pb2.TranscribeResponse(transcription=result['text'])

    def Summarize(self, req: python_pb2.SummarizeRequest, context):
        if req.summarizer == python_pb2.LANGCHAIN:
            chain = load_summarize_chain(llm, chain_type="map_reduce")
            doc = Document(page_content=req.content)
            result = chain.run([doc])
            return python_pb2.SummarizeResponse(summary=result)
        elif req.summarizer == python_pb2.BERT:
            content = req.content
            bert = summarizer.Summarizer()
            result = ""
            for i in range(0, len(content), 512):
                result += bert(content[i:i+512])
            return python_pb2.SummarizeResponse(summary=result)
        else:
            raise Exception(f"Unknown summarizer: {req.summarizer}")

    def YoutubeTranscript(self, request: python_pb2.Video, context):
        result = YouTubeTranscriptApi.get_transcript(request.id)
        return python_pb2.Transcript(transcript=result)


def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  python_pb2_grpc.add_PythonServicer_to_server(
      PythonSerivce(), server)
  server.add_insecure_port('[::]:50051')
  print("Server started on port 50051")
  server.start()
  server.wait_for_termination()

if __name__ == '__main__':
    serve()
