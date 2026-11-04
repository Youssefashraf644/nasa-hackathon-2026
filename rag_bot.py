import os

from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

PERSIST_DIR = "./chroma_db"

# Build or load vector store
loader = TextLoader("nasa_data.txt", encoding="utf-8")
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=400, 
    chunk_overlap=50, 
    separators=["\n\n", "\n", ". ", " ", ""]
)

chunks = splitter.split_documents(documents)

embeddings = OllamaEmbeddings(model="nomic-embed-text")

if os.path.exists(PERSIST_DIR):
    vectorstore = Chroma(persist_directory=PERSIST_DIR, embedding_function=embeddings)
else:
    vectorstore = Chroma.from_documents(
        chunks, embeddings, persist_directory=PERSIST_DIR
    )

retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

# LLM
llm = ChatOllama(model="qwen3:8b", temperature=0)

# prompt
prompt = ChatPromptTemplate.from_template("""

You are a helpful space historian answering questions about NASA missions
and hardware that was left behind on the Moon and Mars.

Answer the question using ONLY the context below.
If the answer is not in the context, say "I don't have that information."
Do not make anything up.

Context:
{context}

Question: {question}

Answer:

""")


# helper to join retrieved chunks into one string
def format_docs(docs):
    if docs and isinstance(docs[0], list):
        docs = [doc for group in docs for doc in group]
    return "\n\n".join(doc.page_content for doc in docs)


# build the chain

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# test questions
questions = [
    "When did the Spirit rover stop working?",
    "What happened to the Apollo 11 Lunar Module?",
    "How long did Viking 1 operate?",
    "Who was the first person to walk on the Sun?",  # deliberately not in data
]

for q in questions:
    print("=" * 60)
    print(f"Q: {q}")
    answer = rag_chain.invoke(q)
    print(f"A: {answer.strip()}")
