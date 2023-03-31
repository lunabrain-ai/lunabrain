from concurrent import futures

from summarizer.sbert import SBertSummarizer

import python_pb2
from python_pb2_grpc import PythonServicer
import python_pb2_grpc

from langchain.chains.summarize import load_summarize_chain
from langchain.llms import OpenAI
from langchain.docstore.document import Document
from langchain.chains import AnalyzeDocumentChain
import grpc
import whisper
from youtube_transcript_api import YouTubeTranscriptApi
import normalize

llm = OpenAI(temperature=0.9)

model = whisper.load_model("base")


class PythonSerivce(PythonServicer):
    def Transcribe(self, req: python_pb2.TranscribeRequest, context):
        result = model.transcribe(req.file)
        return python_pb2.TranscribeResponse(transcription=result['text'])

    def Summarize(self, req: python_pb2.SummarizeRequest, context):
        if req.summarizer == python_pb2.LANGCHAIN:

            # Content is tweet size, so it already is kind of a summary
            if len(req.content) < 150:
                return python_pb2.SummarizeResponse(summary="")

            chain = load_summarize_chain(llm, chain_type="map_reduce")
            summarize_document_chain = AnalyzeDocumentChain(combine_docs_chain=chain)
            result = summarize_document_chain.run(req.content)
            return python_pb2.SummarizeResponse(summary=result)
        elif req.summarizer == python_pb2.BERT:
            content = req.content
            bert = SBertSummarizer('paraphrase-MiniLM-L6-v2')
            result = ""
            for i in range(0, len(content), 512):
                result += bert(content[i:i+512], num_sentences=1)
            return python_pb2.SummarizeResponse(summary=result)
        else:
            raise Exception(f"Unknown summarizer: {req.summarizer}")

    def YoutubeTranscript(self, request: python_pb2.Video, context):
        result = YouTubeTranscriptApi.get_transcript(request.id)
        return python_pb2.Transcript(transcript=result)

    def Normalize(self, request: python_pb2.Text, context):
        normalized = normalize.normalize(request.text)
        return python_pb2.Text(text=normalized)


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
