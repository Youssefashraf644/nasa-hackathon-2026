import os

import streamlit as st
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

PERSIST_DIR = "./chroma_db"

# ---- Page config (must be the first Streamlit call) ----
st.set_page_config(page_title="Abandoned but Not Forgotten", page_icon="🚀")

# ---- Cache the RAG chain so it only builds once ----
@st.cache_resource
def build_rag_chain():
    loader = TextLoader("nasa_data.txt", encoding="utf-8")
    documents = loader.load()
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=400, chunk_overlap=50,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = splitter.split_documents(documents)

    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    if os.path.exists(PERSIST_DIR):
        vectorstore = Chroma(persist_directory=PERSIST_DIR, embedding_function=embeddings)
    else:
        vectorstore = Chroma.from_documents(chunks, embeddings, persist_directory=PERSIST_DIR)

    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    llm = ChatOllama(model="qwen3:8b", temperature=0)

    prompt = ChatPromptTemplate.from_template("""
You are a helpful space historian answering questions about NASA missions
and hardware that was left behind on the Moon and Mars.

Answer the question using ONLY the context below.
If the answer is not in the context, say "I don't have that information."
Be concise. Do not repeat the answer at the end.

Context:
{context}

Question: {question}

Answer:
""")

    def format_docs(docs):
        if docs and isinstance(docs[0], list):
            docs = [doc for group in docs for doc in group]
        return "\n\n".join(doc.page_content for doc in docs)

    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt | llm | StrOutputParser()
    )
    return chain, retriever

# ---- Build once ----
rag_chain, retriever = build_rag_chain()

# ---- Header ----
st.title("🚀 Abandoned but Not Forgotten")
st.caption("Ask about NASA hardware left behind on the Moon and Mars.")

# ---- Chat history in session state ----
if "messages" not in st.session_state:
    st.session_state.messages = []

# ---- Render past messages ----
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# ---- Input box ----
if user_input := st.chat_input("Ask a question..."):
    # Show user message
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)

    # Get answer
    with st.chat_message("assistant"):
        with st.spinner("Searching NASA archives..."):
            answer = rag_chain.invoke(user_input)
        st.markdown(answer)

    st.session_state.messages.append({"role": "assistant", "content": answer})