import logging
import os
import sys
from concurrent import futures
from grpc_reflection.v1alpha import reflection

from summarizer.sbert import SBertSummarizer

import python_pb2
import categorize
from llama_indexer import LLamaIndexer
from indexing.faiss_index import FaissIndexer
from indexing.bm25_index import Bm25Indexer
from python_pb2_grpc import PythonServicer
import python_pb2_grpc

from langchain.chains.summarize import load_summarize_chain
from langchain.llms import OpenAI
from langchain.chains import AnalyzeDocumentChain
import grpc
import whisper
from youtube_transcript_api import YouTubeTranscriptApi
import normalize
from keybert import KeyBERT

if os.environ.get('LOG_LEVEL') is not None and os.environ.get('LOG_LEVEL').lower() == "debug":
    logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
    logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))

llm = OpenAI(temperature=0.9)

model = whisper.load_model("base")
kw_model = KeyBERT()

normalizer = normalize.Normalizer()
categorizer = categorize.Categorizer()

llama_indexer = LLamaIndexer()
faiss_indexer = FaissIndexer()
bm25_indexer = Bm25Indexer()

def question_generator():
    # https://github.com/AMontgomerie/question_generator
    # https://huggingface.co/iarfmoose/t5-base-question-generator?text=This+model+is+a+sequence-to-sequence+question+generator+which+takes+an+answer+and+context+as+an+input%2C+and+generates+a+question+as+an+output.+It+is+based+on+a+pretrained+t5-base+model.
    pass

class PythonSerivce(PythonServicer):
    def Transcribe(self, req: python_pb2.TranscribeRequest, context):
        result = model.transcribe(req.file)
        return python_pb2.TranscribeResponse(transcription=result['text'])

    def Summarize(self, req: python_pb2.SummarizeRequest, context):
        print("Summarizing with", req.summarizer)

        if req.summarizer == python_pb2.LANGCHAIN:

            # Content is tweet size, so it already is kind of a summary
            if len(req.content) < 150:
                return python_pb2.SummarizeResponse(summary=req.content)

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
        normalized = normalizer.normalize(request.text)
        return python_pb2.Text(text=normalized)

    def Categorize(self, request: python_pb2.CategorizeRequest, context):
        print("Categorizing with", request.categorizer)
        if request.categorizer == python_pb2.T5_TAG:
            categories = categorizer.categorize(request.text)
        elif request.categorizer == python_pb2.KEYBERT:
            keywords = kw_model.extract_keywords(request.text, keyphrase_ngram_range=(1, 2))
            categories = [k[0] for k in keywords]
        else:
            raise Exception(f"Unknown categorizer: {request.categorizer}")
        return python_pb2.Categories(categories=categories)

    def IndexDirectory(self, request: python_pb2.IndexDirectoryRequest, context):
        print("Indexing directory", request.path)
        index_id = None
        if request.type == python_pb2.LLAMA:
            index_id = llama_indexer.create(request.path)
        elif request.type == python_pb2.FAISS:
            index_id = faiss_indexer.create(request.path)
        elif request.type == python_pb2.BM25:
            index_id = bm25_indexer.create(request.path)
        else:
            raise Exception(f"Unknown index type: {request.type}")
        return python_pb2.Index(id=index_id, type=request.type)

    def QueryIndex(self, request: python_pb2.Query, context):
        print("Querying index", request.index)
        result = None
        if request.type == python_pb2.LLAMA:
            result = llama_indexer.query(request.index, request.query)
        elif request.type == python_pb2.FAISS:
            result = faiss_indexer.query(request.index, request.query)
        elif request.type == python_pb2.BM25:
            result = bm25_indexer.query(request.index, request.query)
        else:
            raise Exception(f"Unknown index type: {request.type}")
        return python_pb2.QueryResult(results=[str(result)])


def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  python_pb2_grpc.add_PythonServicer_to_server(
      PythonSerivce(), server)
  SERVICE_NAMES = (
      python_pb2.DESCRIPTOR.services_by_name['Python'].full_name,
      reflection.SERVICE_NAME,
  )
  reflection.enable_server_reflection(SERVICE_NAMES, server)

  server.add_insecure_port('[::]:50051')
  print("Server started on port 50051")
  server.start()
  server.wait_for_termination()

if __name__ == '__main__':
    serve()
