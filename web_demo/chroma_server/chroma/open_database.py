import chromadb
from chromadb.config import Settings

# Đường dẫn tới thư mục chứa cơ sở dữ liệu (không phải file .sqlite3)
client = chromadb.PersistentClient(path="./chroma_db")  # sửa path nếu khác

# Tên collection đã tạo khi dump
collection = client.get_or_create_collection(name="blog_posts")  # đổi tên nếu bạn dùng tên khác

# Lấy dữ liệu kèm embedding
results = collection.get(include=["embeddings", "documents", "metadatas"])

# In ra các documents
for i in range(len(results["ids"])):
    print(f"ID: {results['ids'][i]}")
    print(f"Document: {results['documents'][i]}")
    print(f"Embedding length: {len(results['embeddings'][i])}")
    print(f"Embedding sample: {results['embeddings'][i][:10]}")  # chỉ in 10 số đầu
    print("-" * 50)
