import chromadb
from chromadb.config import Settings

client = chromadb.PersistentClient(path="../chroma-data")

print("📂 Danh sách collections hiện có:")
print(client.list_collections())

collection = client.get_or_create_collection(name="blog_vi")
print(f"📌 Đang dùng collection: {collection.name}")

results = collection.get(include=["embeddings", "documents", "metadatas"])

if len(results["ids"]) == 0:
    print("⚠️ Collection trống, không có dữ liệu.")
else:
    for i in range(len(results["ids"])):
        print(f"ID: {results['ids'][i]}")
        print(f"Document: {results['documents'][i]}")
        print(f"Embedding length: {len(results['embeddings'][i])}")
        print(f"Embedding sample: {results['embeddings'][i][:10]}")
        print(f"Metadatas: {results['metadatas'][i]}")
        print("-" * 50)
