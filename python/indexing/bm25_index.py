import json
import os
import pickle

import nltk
import numpy as np
from rank_bm25 import BM25Okapi
from slugify import slugify

from indexing.indexes import index_dir, make_if_not_exist, new_index_file, get_content_index_dir, split_into_paragraphs

bm25_index_type_dir = "bm25"
bm25_index_dir = os.path.join(index_dir, bm25_index_type_dir)
bm25_index_filename = "index.pickle"
paragraph_id_to_file_file = "paragraph_id_to_file.json"


def load_bm25_indexes(index_type_dir):
    make_if_not_exist(index_type_dir)

    print(f"Loading indexes from {index_type_dir}...")
    index_lookup = {}
    for folder in os.listdir(index_type_dir):
        indx = os.path.join(index_type_dir, folder, bm25_index_filename)
        paragraph_lookup = os.path.join(index_type_dir, folder, paragraph_id_to_file_file)

        if os.path.exists(indx) and os.path.exists(paragraph_lookup):
            print(f"Found index {folder}")
            p = json.load(open(paragraph_lookup))
            index_lookup[folder] = {
                "index": pickle.load(open(indx, "rb")),
                "index_paragraph_ids": p["index_paragraph_ids"],
                "paragraph_lookup": p["paragraph_lookup"]
            }

    return index_lookup


def get_paragraphs_and_lookup(text) -> [list, dict]:
    paragraph_lookup = {}

    paragraphs = split_into_paragraphs(text)

    if len(paragraphs) == 0:
        return paragraph_lookup

    ids = []
    for paragraph in paragraphs:
        ids += [hash(paragraph)]
        paragraph_lookup[hash(paragraph)] = paragraph

    return paragraph_lookup


class Bm25Indexer:
    index_lookup: dict = {}

    def __init__(self):
        self.index_lookup = load_bm25_indexes(bm25_index_dir)

    def create(self, content_dir) -> str:
        slug, content_index_dir = get_content_index_dir(bm25_index_dir, content_dir)
        make_if_not_exist(content_index_dir)

        index_file = os.path.join(content_index_dir, bm25_index_filename)

        # Recursively crawl the directory and add all the files to the index
        paragraph_id_to_file = {}
        index_paragraphs = []
        index_paragraph_ids = []
        for root, dirs, files in os.walk(content_dir):
            for file in files:
                if file.endswith(".html"):
                    file_path = os.path.join(root, file)
                    print("Adding file to index", file_path)
                    paragraph_lookup = get_paragraphs_and_lookup(open(file_path, "r").read())
                    for paragraph_id, paragraph in paragraph_lookup.items():
                        index_paragraphs += [nltk.word_tokenize(paragraph)]
                        index_paragraph_ids += [paragraph_id]
                        paragraph_id_to_file[str(paragraph_id)] = {
                            "file": file_path,
                            "paragraph": paragraph
                        }

        index = BM25Okapi(index_paragraphs)
        pickle.dump(index, open(index_file, "wb"))

        # Save the index
        save_file = os.path.join(content_index_dir, paragraph_id_to_file_file)
        p = {
            "index_paragraph_ids": index_paragraph_ids,
            "paragraph_lookup": paragraph_id_to_file
        }
        open(save_file, 'w+').write(json.dumps(p))

        print(f"Created index {content_dir} at {index_file} (documents)")
        self.index_lookup[slug] = {
            "index": index,
            **p,
        }
        return slug

    def query(self, content_dir, query):
        top_k = 10
        slug = slugify(content_dir)

        index_info = self.index_lookup[slug]
        if index_info is None:
            raise Exception(f"Index {slug} not found")

        index = index_info["index"]

        tokenized_query = nltk.word_tokenize(query)
        print(tokenized_query)
        bm25_scores = index.get_scores(tokenized_query)
        top_k = min(top_k, len(bm25_scores))
        top_n = np.argpartition(bm25_scores, -top_k)[-top_k:]
        bm25_hits = [{'id': index_info["index_paragraph_ids"][idx], 'score': bm25_scores[idx]} for idx in top_n]
        bm25_hits = sorted(bm25_hits, key=lambda x: x['score'], reverse=True)
        print(bm25_hits)
        result_ids = [hit['id'] for hit in bm25_hits]

        returned_results = []
        for result_id in result_ids:
            returned_results.append(index_info["paragraph_lookup"][str(result_id)])
        return json.dumps(returned_results)
