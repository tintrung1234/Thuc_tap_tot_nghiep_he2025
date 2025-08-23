import chromadb
from sentence_transformers import SentenceTransformer

# 1. Kết nối tới collection
client = chromadb.PersistentClient(path="./chroma-data")
collection = client.get_collection("blog_vi")

print(f"Collection size: {collection.count()}")

# Lấy toàn bộ documents kèm embeddings
results = collection.get(include=["embeddings", "documents", "metadatas"])

print("Số lượng:", len(results["ids"]))  # In 10 giá trị đầu tiên
print("Vector đầu tiên:", results["embeddings"][0][:10])  # type: ignore
print("Document:", results["documents"][0])  # type: ignore
print("Metadata:", results["metadatas"][0])  # type: ignore

# 2. Load embedding model
model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

# 3. Nếu collection trống thì báo lỗi
if collection.count() == 0:
    print(
        "⚠️ Collection 'blog_vi' chưa có dữ liệu. Bạn cần insert chunks trước khi query."
    )
else:
    # 4. Thực hiện query
    query = "Ẩm thực Hà Nội"
    query_emb = model.encode([query], convert_to_numpy=True, normalize_embeddings=True)

    results = collection.query(query_embeddings=query_emb.tolist(), n_results=3)

    # 5. Kiểm tra dữ liệu trả về
    if results["documents"] is None:
        print("❌ Không tìm thấy kết quả nào khớp với query.")
    elif results["metadatas"] is None:
        print("❌ Không tìm thấy kết quả nào khớp với query.")
    else:
        for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
            print(f"Title: {meta['title']}, Chunk: {doc}")
