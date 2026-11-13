import os

from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

loader = TextLoader("nasa_data.txt", encoding="utf-8")
documents = loader.load()
splitter = RecursiveCharacterTextSplitter(
    chunk_size=400, chunk_overlap=50, separators=["\n\n", "\n", ". ", " ", ""]
)
chunks = splitter.split_documents(documents)
embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})  # k=3 to see more

for q in [
    "When did the Spirit rover stop working?",
    "What happened to the Apollo 11 Lunar Module?",
]:
    print("=" * 60)
    print(f"Q: {q}")
    results = retriever.invoke(q)
    if results and isinstance(results[0], list):
        results = results[0]
    for i, doc in enumerate(results):
        print(f"  [{i + 1}] {doc.page_content[:90]}...")
