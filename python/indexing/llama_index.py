import faiss
from llama_index import GPTFaissIndex, SimpleDirectoryReader

# dimensions of text-ada-embedding-002
d = 1536
faiss_index = faiss.IndexFlatL2(d)


documents = SimpleDirectoryReader('../paul_graham_essay/data').load_data()
index = GPTFaissIndex.from_documents(documents, faiss_index=faiss_index)
index.save_to_disk(
    'index_faiss.json',
    faiss_index_save_path="index_faiss_core.index"
)


# load index from disk
index = GPTFaissIndex.load_from_disk(
    'index_faiss.json',
    faiss_index_save_path="index_faiss_core.index"
)

response = index.query("What did the author do growing up?")
