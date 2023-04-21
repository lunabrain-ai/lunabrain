import os

from sentence_transformers import SentenceTransformer
from transformers import GPT2Tokenizer

sentence_model = SentenceTransformer("all-MiniLM-L6-v2")
t = GPT2Tokenizer.from_pretrained("gpt2")

cache = os.environ['TRANSFORMERS_CACHE']

# TODO breadchris how do you save this?
sentence_model.save_pretrained(cache)
t.save_pretrained(cache)
