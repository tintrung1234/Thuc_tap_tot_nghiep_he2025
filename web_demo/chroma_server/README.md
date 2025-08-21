# 📌 Blog Search with ChromaDB + Vietnamese NLP

Dự án này xây dựng hệ thống **tìm kiếm thông minh** cho blog tiếng Việt,
sử dụng: - **Chunking + Vietnamese NLP** (underthesea) -
**Embedding** bằng Sentence-BERT - **Vector Database** với
[ChromaDB](https://docs.trychroma.com/)

---

## 🚀 Công nghệ sử dụng

- [Python 3.11](https://www.python.org/)
- [ChromaDB](https://github.com/chroma-core/chroma) -- lưu trữ vector
  embedding
- [Sentence-Transformers](https://www.sbert.net/) -- tạo embeddings
- [underthesea](https://github.com/undertheseanlp/underthesea) -- phân
  câu

---

## ⚙️ Cài đặt

1.  **Clone repo**

    ```bash
    git clone https://github.com/tintrung1234/Thuc_tap_tot_nghiep_he2025.git
    cd web-demo/chroma_server
    ```

2.  **Tạo môi trường ảo & cài dependencies**

    ```bash
    python -m venv .venv
    source .venv/bin/activate   # Linux / MacOS
    .venv\Scripts\activate      # Windows

    pip install -r requirements.txt
    ```

3.  **Cấu hình**

        - File `.env` chứa config (ví dụ `DB_PATH`, `EMBEDDING_MODEL`).
        CHROMA_COLLECTION=
        EMBED_MODEL=
        MAX_TOKENS=
        OVERLAP=
        BATCH_SIZE=
        CHROMA_PATH=
        BACKEND_API_URL=
        ETL_API_URL=

---

## 🏗️ Pipeline ETL

Pipeline nằm trong thư mục `etl/`: - `text_processing.py` → xử lý văn
bản thô - `chunking.py` → chia nhỏ văn bản thành chunks - `embedding.py`
→ tạo vector embedding từ Sentence-BERT - `database.py` → insert/update
dữ liệu vào ChromaDB - `main.py` → script chính để chạy ETL

Chạy ETL để load dữ liệu vào Chroma:

```bash
python -m etl.main
```

Chạy chroma server:

```bash
chroma run --path ./chroma-data --port 8000
```

Chạy Ollama:

```bash
ollama run mistral
```

---

## 🔍 Query dữ liệu

Ví dụ tìm kiếm:

```python
import chromadb
from sentence_transformers import SentenceTransformer

# 1. Kết nối tới collection
client = chromadb.PersistentClient(path="./chroma-data")
collection = client.get_collection("blog_vi")

print(f"Collection size: {collection.count()}")

# 2. Load embedding model
model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

# 3. Nếu collection trống thì báo lỗi
if collection.count() == 0:
    print("⚠️ Collection 'blog_vi' chưa có dữ liệu. Bạn cần insert chunks trước khi query.")
else:
    # 4. Thực hiện query
    query = "Ẩm thực Hà Nội"
    query_emb = model.encode(
        [query], convert_to_numpy=True, normalize_embeddings=True)

    results = collection.query(
        query_embeddings=query_emb.tolist(), n_results=3)

    # 5. Kiểm tra dữ liệu trả về
    if results["documents"] is None:
        print("❌ Không tìm thấy kết quả nào khớp với query.")
    elif results['metadatas'] is None:
        print("❌ Không tìm thấy kết quả nào khớp với query.")
    else:
        for doc, meta in zip(results['documents'][0], results['metadatas'][0]):
            print(f"Title: {meta['title']}, Chunk: {doc}")
```

---

## 📂 Cấu trúc thư mục

    ├── .venv/
    ├── chroma-data/           # vector database (persistent)
    ├── etl/                   # ETL pipeline
    │   ├── __init__.py
    │   ├── chunking.py
    │   ├── config.py
    │   ├── database.py
    │   ├── embedding.py
    │   ├── main.py
    │   └── text_processing.py
    ├── requirements.txt
    ├── .env
    └── README.md

---

## 🛠️ Troubleshooting

- **`ModuleNotFoundError: No module named 'etl'`** → chạy script bằng
  `python -m etl.main` thay vì `python etl/main.py`.

- **Chroma không có dữ liệu**\
  → đảm bảo đã chạy ETL để nạp dữ liệu (`python -m etl.main`).

---

## 📜 License

MIT License © 2025

# Cách chạy file server:
Vào thư mục etl

uvicorn server:app --host 0.0.0.0 --port 8001 --reload

