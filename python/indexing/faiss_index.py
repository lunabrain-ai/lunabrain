import json
import os
import re

import torch
import faiss
from slugify import slugify

from indexing.indexes import index_dir, load_indexes, new_index_file, get_content_index_dir, make_if_not_exist
from indexing.models import bi_encoder

MODEL_DIM = 384
faiss_index_type_dir = "faiss"
faiss_index_dir = os.path.join(index_dir, faiss_index_type_dir)
paragraph_id_to_file_file = "paragraph_id_to_file.json"
faiss_index_filename = "index.faiss"


def load_faiss_indexes(index_type_dir):
    make_if_not_exist(index_type_dir)

    print(f"Loading indexes from {index_type_dir}...")
    index_lookup = {}
    for folder in os.listdir(index_type_dir):
        indx = os.path.join(index_type_dir, folder, faiss_index_filename)
        paragraph_lookup = os.path.join(index_type_dir, folder, paragraph_id_to_file_file)

        if os.path.exists(indx) and os.path.exists(paragraph_lookup):
            print(f"Found index {folder}")
            index_lookup[folder] = {
                "index": faiss.read_index(indx),
                "paragraph_lookup": json.load(open(paragraph_lookup))
            }

    return index_lookup


def split_into_paragraphs(text, minimum_length=256):
    """
    split into paragraphs and batch small paragraphs together into the same paragraph
    """
    if text is None:
        return []
    paragraphs = []
    current_paragraph = ''
    for paragraph in re.split(r'\n\s*\n', text):
        if len(current_paragraph) > 0:
            current_paragraph += ' '
        current_paragraph += paragraph.strip()

        if len(current_paragraph) > minimum_length:
            paragraphs.append(current_paragraph)
            current_paragraph = ''

    if len(current_paragraph) > 0:
        paragraphs.append(current_paragraph)

    return paragraphs


def add_text_to_index(index, text) -> dict:
    paragraph_lookup = {}

    paragraphs = split_into_paragraphs(text)

    if len(paragraphs) == 0:
        return paragraph_lookup

    ids = []
    for paragraph in paragraphs:
        ids += [hash(paragraph)]
        paragraph_lookup[hash(paragraph)] = paragraph

    embeddings = bi_encoder.encode(paragraphs, convert_to_tensor=True, show_progress_bar=True)

    # Add the embeddings to the index
    index.add_with_ids(embeddings.cpu(), torch.tensor(ids))
    return paragraph_lookup


class FaissIndexer:
    instance = None
    index_lookup: dict = {}

    def __init__(self) -> None:
        self.index_lookup = load_faiss_indexes(faiss_index_dir)

    def create(self, content_dir) -> str:
        slug, content_index_dir = get_content_index_dir(faiss_index_dir, content_dir)
        make_if_not_exist(content_index_dir)

        index_file = os.path.join(content_index_dir, faiss_index_filename)

        index = faiss.IndexFlatIP(MODEL_DIM)
        index = faiss.IndexIDMap(index)

        # Recursively crawl the directory and add all the files to the index
        paragraph_id_to_file = {}
        for root, dirs, files in os.walk(content_dir):
            for file in files:
                if file.endswith(".html"):
                    file_path = os.path.join(root, file)
                    print("Adding file to index", file_path)
                    paragraph_lookup = add_text_to_index(index, open(file_path, "r").read())
                    for paragraph_id, paragraph in paragraph_lookup.items():
                        paragraph_id_to_file[str(paragraph_id)] = {
                            "file": file_path,
                            "paragraph": paragraph
                        }

        faiss.write_index(index, index_file)

        # Save the index
        save_file = os.path.join(content_index_dir, paragraph_id_to_file_file)
        open(save_file, 'w+').write(json.dumps(paragraph_id_to_file))

        print(f"Created index {content_dir} at {index_file} (documents)")
        self.index_lookup[slug] = {
            "index": index,
            "paragraph_lookup": paragraph_id_to_file
        }
        return slug

    def query(self, content_dir, query):
        slug = slugify(content_dir)

        index_info = self.index_lookup[slug]
        if index_info is None:
            raise Exception(f"Index {slug} not found")

        queries = bi_encoder.encode(query, convert_to_tensor=True, show_progress_bar=False)
        if queries.ndim == 1:
            queries = queries.unsqueeze(0)

        index = index_info["index"]
        _, results = index.search(queries.cpu(), 20)
        results = results[0]
        result_ids = [int(id) for id in results if id != -1]

        returned_results = []
        for result_id in result_ids:
            returned_results.append(index_info["paragraph_lookup"][str(result_id)])
        return json.dumps(returned_results)

    # def update(self, ids: torch.LongTensor, embeddings: torch.FloatTensor):
    #     self.index.add_with_ids(embeddings.cpu(), ids)
    #
    #     faiss.write_index(self.index, FAISS_INDEX_PATH)
    #
    # def remove(self, ids: torch.LongTensor):
    #     self.index.remove_ids(torch.tensor(ids))
    #
    #     faiss.write_index(self.index, FAISS_INDEX_PATH)
    # def clear(self):
    #     self.index.reset()
    #     faiss.write_index(self.index, FAISS_INDEX_PATH)
