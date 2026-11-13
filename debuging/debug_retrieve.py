from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings

from chatbot.rag import CHROMA_DIR, EMBED_MODEL

TARGET_ARTIFACT = "spirit"           # testing artifact isolation
QUERY = "What did you discover?"
K=5                                  #fetch a few to make false positives obvious 

def main():
    embeddings = OllamaEmbeddings(model=EMBED_MODEL)
    store = Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)

    results = store.similarity_search(
        QUERY, k=K, filter={"artifact_id": TARGET_ARTIFACT}
    )

    print(f"Query: {QUERY!r} Filter: artifact_id == {TARGET_ARTIFACT!r}")
    print(f"Returned {len(results)} chunks.\n")

    ok = True
    for i, doc in enumerate(results, 1):
        aid = doc.metadata.get("artifact_id")
        snippet = doc.page_content[:80].replace("\n", " ")
        print(f"[{i}] artifact_id={aid!r}  source={doc.metadata.get('source')}")
        print(f"    {snippet}...")
        if aid != TARGET_ARTIFACT:
            ok = False

    print("\nRESULT:", "PASS — every chunk is "+ TARGET_ARTIFACT if ok else "FAIL — contamination detected" ,)


if __name__ == "__main__":
    main()

    