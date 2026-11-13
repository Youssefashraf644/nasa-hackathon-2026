# One-shot batch job: reads data/*.txt, attaches artifact_id metadata, rebuilds ./chroma_db.
# Run this whenever data/ changes. It is idempotent — safe to run repeatedly.

import glob
import os
import shutil

from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

from chatbot.rag import CHROMA_DIR, EMBED_MODEL

_CHATBOT_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.dirname(_CHATBOT_DIR)
DATA_DIR = os.path.join(_PROJECT_ROOT, "data")

CHUNK_SIZE = 500           # short paragraph keeps fact + context 
CHUNK_OVERLAP = 50         # overlap so no mid-fact split 

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")


def ingest():
    paths = sorted(glob.glob(os.path.join(DATA_DIR, "*.txt")))
    print(f"Looking for .txt files in: {DATA_DIR}")
    if not paths:
        print("No .txt files found in {DATA_DIR}")
        return
    if os.path.exists(CHROMA_DIR):
        shutil.rmtree(CHROMA_DIR)
        print(f"Removed old vector store at {CHROMA_DIR}")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size = CHUNK_SIZE, chunk_overlap = CHUNK_OVERLAP
    )
    all_chunks = []

    for path in paths:
        artifact_id = os.path.splitext(os.path.basename(path))[0]
        print(f"Loading {path} as artifact_id={artifact_id}")

        docs = TextLoader(path, encoding="utf-8").load()
        chunks = splitter.split_documents(docs)


        # attatch the artifact_id to every chunk retriever filter in rag.py
        for c in chunks:
            c.metadata["artifact_id"] = artifact_id
            c.metadata["source"] = path               #keep the path for debugging 

        all_chunks.extend(chunks)
        print(f"---- {len(chunks)} chunks")

    if not all_chunks:
        print("Splitter produced 0 chunks")
        return

    print(f"Total chunks: {len(all_chunks)} chunks")

    embeddings = OllamaEmbeddings(model=EMBED_MODEL)

    #from_documents returns a Chroma client writes to disk 
    Chroma.from_documents(
        documents=all_chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DIR,
    )
    print(f"Persisted {len(all_chunks)} chunks to {CHROMA_DIR}")


if __name__ == "__main__":
    ingest()
    