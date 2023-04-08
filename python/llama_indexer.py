import os

from llama_index import GPTSimpleVectorIndex, SimpleDirectoryReader, LLMPredictor
from langchain.chat_models import ChatOpenAI
from slugify import slugify

from indexing.indexes import index_dir, index_filename, load_indexes, new_index_file

llm_predictor = LLMPredictor(llm=ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo"))


llama_index_type_dir = "llama"
llama_index_dir = os.path.join(index_dir, llama_index_type_dir)


class LLamaIndexer:
    index_lookup: dict = {}

    def __init__(self):
        for k, v in load_indexes(llama_index_dir).items():
            self.index_lookup[k] = GPTSimpleVectorIndex.load_from_disk(v)

    def create(self, content_dir) -> str:
        slug, index_file = new_index_file(llama_index_dir, content_dir)

        documents = SimpleDirectoryReader(content_dir, required_exts=[".html"], recursive=True).load_data()
        index = GPTSimpleVectorIndex(documents)
        index.save_to_disk(index_file)

        print(f"Created index {content_dir} at {index_file} ({len(documents)} documents)")
        self.index_lookup[slug] = index
        return index_file

    def query(self, content_dir, query):
        slug = slugify(content_dir)

        index = self.index_lookup[slug]
        if index is None:
            raise Exception(f"Index {slug} not found")

        return index.query(query, llm_predictor=llm_predictor, similarity_top_k=3)
