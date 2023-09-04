import numpy as np
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer
import faiss

class HybridSearch:
    def __init__(self, documents):
        self.documents = documents

        # BM25 initialization
        tokenized_corpus = [doc.split(" ") for doc in documents]
        self.bm25 = BM25Okapi(tokenized_corpus)

        # Sentence transformer for embeddings
        self.model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
        self.document_embeddings = self.model.encode(documents)
        
        # FAISS initialization
        self.index = faiss.IndexFlatL2(self.document_embeddings.shape[1])
        self.index.add(np.array(self.document_embeddings).astype('float32'))

    def search(self, query, top_n=10):
        # BM25 search
        bm25_scores = self.bm25.get_scores(query.split(" "))
        top_docs_indices = np.argsort(bm25_scores)[-top_n:]
        
        # Get embeddings of top documents from BM25 search
        top_docs_embeddings = [self.document_embeddings[i] for i in top_docs_indices]
        query_embedding = self.model.encode([query])

        # FAISS search on the top documents
        sub_index = faiss.IndexFlatL2(top_docs_embeddings[0].shape[0])
        sub_index.add(np.array(top_docs_embeddings).astype('float32'))
        _, sub_dense_ranked_indices = sub_index.search(np.array(query_embedding).astype('float32'), top_n)

        # Map FAISS results back to original document indices
        final_ranked_indices = [top_docs_indices[i] for i in sub_dense_ranked_indices[0]]

        # Retrieve the actual documents
        ranked_docs = [self.documents[i] for i in final_ranked_indices]

        return ranked_docs

# Sample usage
documents = [
    "Artificial Intelligence is changing the world.",
    "Machine Learning is a subset of AI.",
    "Deep Learning is a subset of Machine Learning.",
    "Natural Language Processing involves understanding text.",
    "Computer Vision allows machines to see and understand.",
    "AI includes areas like NLP and Computer Vision.",
    "The Pyramids of Giza are architectural marvels.",
    "Mozart was a prolific composer during the classical era.",
    "Mount Everest is the tallest mountain on Earth.",
    "The Nile is one of the world's longest rivers.",
    "Van Gogh's Starry Night is a popular piece of art.",
    "Basketball is a sport played with a round ball and two teams."
]

hs = HybridSearch(documents)
query = "Tell me about AI in text and vision."
results = hs.search(query, top_n=10)
print(results)
