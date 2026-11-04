from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# load file
loader = TextLoader("nasa_data.txt", encoding="utf-8")
documents = loader.load()
print(f"Loaded {len(documents)} document")
print(f"Total characters in file: {len(documents[0].page_content)}")
print("=" * 60)

# split into chunks
splitter = RecursiveCharacterTextSplitter(
    chunk_size=400, chunk_overlap=50, separators=["\n\n", "\n", ". ", " ", ""]
)

chunks = splitter.split_documents(documents)

print(f"Created {len(chunks)} chunks")
print("=" * 60)

# print every chunk for inspection
for i, chunk in enumerate(chunks):
    print(f"\n--- CHUNK {i + 1} ({len(chunk.page_content)} chars) ---")
    print(chunk.page_content)
