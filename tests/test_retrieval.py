import os

from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

PERSIST_DIR = "./chroma_db" # saves to disk so we don't re-embed every run

# load abd chunk 
loader = TextLoader("nasa_data.txt", encoding="utf-8")
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size = 400,
    chunk_overlap = 50,
    separators=["\n\n", "\n", ". ", " ", ""]
)

chunks = splitter.split_documents(documents)
print(f"Loaded {len(chunks)} chunks")

# create embeddings using Ollama (Embeddings)
embeddings = OllamaEmbeddings(model="nomic-embed-text")

# store chunks + embeddings in Chroma / Build or Load vector store (idempotent)
if os.path.exists(PERSIST_DIR):
    print("Loading existing vector store ...")
    vectorstore= Chroma(
        persist_directory=PERSIST_DIR,
        embedding_function=embeddings
    )
else:
    print("Bulding vector store (this may take 10 - 20 seconds) ..")
    vectorstore = Chroma.from_documents(

        documents=chunks,
        embedding=embeddings,
        persist_directory=PERSIST_DIR,  
    )
    print("Vector store built and saved.")

print("=" * 60)

# ask a test queston and check the answer (search)
query = "When did the Spirit rover stop working?"
print(f"QUERY: {query}\n")

results = vectorstore.similarity_search(query, k=2)

for i, doc in enumerate(results):
    print(f"--- RESULTS {i+1} ---")
    print(doc.page_content)
    print()