# server/chroma/dump_from_api_to_chroma.py

import requests
from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer
from bs4 import BeautifulSoup  # Thêm thư viện này để xử lý HTML

# ========== Config ==========

API_URL = "http://localhost:5000/api/posts"  # thay đổi nếu khác
CHROMA_DB_DIR = "./chroma_db"

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# ========== Gọi API ==========

response = requests.get(API_URL)

if response.status_code != 200:
    raise Exception("❌ Không thể lấy dữ liệu từ API!")

posts = response.json()

# ========== Kết nối Chroma ==========

chroma_client = PersistentClient(path=CHROMA_DB_DIR)
collection = chroma_client.get_or_create_collection(name="blog_posts")

# ========== Chuẩn bị dữ liệu ==========

ids = []
texts = []
metadatas = []

for post in posts:
    _id = str(post["_id"])
    title = post.get("title", "")
    content = post.get("description", "")

    # Chuyển HTML thành plain text
    soup = BeautifulSoup(content, "html.parser")
    full_content = soup.get_text(separator=" ", strip=True)

    # Ghép tiêu đề và nội dung
    full_text = f"{title}\n{full_content}"

    ids.append(_id)
    texts.append(full_text)
    metadatas.append({ "title": title })

# ========== Embed ==========

embeddings = model.encode(texts).tolist()

# ========== Dump vào Chroma ==========

collection.add(
    documents=texts,
    metadatas=metadatas,
    ids=ids,
    embeddings=embeddings
)

print(f"✅ Đã thêm {len(texts)} bài viết từ API vào Chroma.")
