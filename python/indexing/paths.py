from pathlib import Path
import os

STORAGE_PATH = Path(f'/home/{os.getlogin()}/.lunabrain/faiss/')

if not STORAGE_PATH.exists():
    STORAGE_PATH.mkdir(parents=True)

SQLITE_INDEXING_PATH = STORAGE_PATH / 'indexing.sqlite3'
FAISS_INDEX_PATH = str(STORAGE_PATH / 'faiss_index.bin')
BM25_INDEX_PATH = str(STORAGE_PATH / 'bm25_index.bin')
