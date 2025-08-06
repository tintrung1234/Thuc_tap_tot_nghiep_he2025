import chromadb
from chromadb.config import Settings

# Đường dẫn tới thư mục chứa cơ sở dữ liệu (không phải file .sqlite3)
client = chromadb.PersistentClient(path="./chroma_db")  # sửa path nếu khác

# Tên collection đã tạo khi dump
collection = client.get_or_create_collection(name="blog_posts")  # đổi tên nếu bạn dùng tên khác

# Lấy tất cả dữ liệu
results = collection.get(include=["documents", "metadatas"])

# In ra các documents
for i, doc in enumerate(results["documents"]):
    print(f"\n--- Document {i + 1} ---")
    print("Content:", doc)
    print("Metadata:", results["metadatas"][i])
