# 📌 Blog Search with ChromaDB + Vietnamese NLP

This project builds an **intelligent search system** for a Vietnamese blog, utilizing:

- **Chunking + Vietnamese NLP** with [underthesea](https://github.com/undertheseanlp/underthesea)
- **Embedding** with Sentence-BERT
- **Vector Database** with [ChromaDB](https://docs.trychroma.com/)

The `chroma_server` directory contains the ETL pipeline and API server for indexing blog posts into ChromaDB, integrated with a NodeJS backend for data retrieval.

---

## 🚀 Technologies Used

- [Python 3.11](https://www.python.org/) - Core language for ETL pipeline
- [ChromaDB](https://github.com/chroma-core/chroma) - Vector database for storing embeddings
- [Sentence-Transformers](https://www.sbert.net/) - Embedding generation
- [underthesea](https://github.com/undertheseanlp/underthesea) - Vietnamese sentence segmentation
- [Flask](https://flask.palletsprojects.com/) - API server for ETL processing
- [Requests](https://requests.readthedocs.io/) - HTTP client for backend integration

---

## ⚙️ Setup and Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/tintrung1234/Thuc_tap_tot_nghiep_he2025.git
   cd web_demo/chroma_server
   ```

2. **Create Virtual Environment & Install Dependencies**

   ```bash
   python -m venv .venv
   source .venv/bin/activate   # Linux / macOS
   .venv\Scripts\activate      # Windows
   pip install -r requirements.txt
   ```

3. **Configuration**

   Create a `.env` file in the `chroma_server` directory with the following variables:

   ```env
   CHROMA_COLLECTION=
   EMBED_MODEL=
   MAX_TOKENS=
   OVERLAP=
   BATCH_SIZE=
   CHROMA_PATH=
   BACKEND_API_URL=
   ETL_API_URL=
   ```

   - `CHROMA_COLLECTION`: Name of the Chroma collection.
   - `EMBED_MODEL`: Sentence-Transformers model for embeddings.
   - `MAX_TOKENS`: Maximum tokens per chunk.
   - `OVERLAP`: Token overlap between chunks.
   - `BATCH_SIZE`: Batch size for embedding.
   - `CHROMA_PATH`: Directory for Chroma data.
   - `BACKEND_API_URL`: NodeJS backend API for fetching posts.
   - `ETL_API_URL`: ETL Flask API endpoint.

---

## 🏗️ ETL Pipeline

The ETL pipeline is located in the `etl/` directory:

- `text_processing.py`: Cleans raw HTML and segments text into sentences.
- `chunking.py`: Splits text into chunks based on token limits.
- `embedding.py`: Generates vector embeddings using Sentence-BERT.
- `database.py`: Inserts/updates data in ChromaDB.
- `main.py`: Flask API server for processing posts from the backend.
- `return_etl.py`: Script to re-run ETL for all published posts.

To re-run ETL for all posts (fetches data from `BACKEND_API_URL`):

```bash
python return_etl.py
```

To start the ETL API server:

```bash
python -m etl.main
```

Can run ETL with json file without api NodeJS:

```bash
python -m etl.main --post posts.json
```

To start the Chroma server:

```bash
chroma run --path ./chroma-data --port 8000
```

---

## 🔍 Querying Data

Example script to query ChromaDB:

```python
import chromadb
from sentence_transformers import SentenceTransformer

# 1. Connect to collection
client = chromadb.PersistentClient(path="./chroma-data")
collection = client.get_collection("blog_vi")

print(f"Collection size: {collection.count()}")

# 2. Load embedding model
model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

# 3. Check if collection is empty
if collection.count() == 0:
    print("⚠️ Collection 'blog_vi' is empty. Run ETL to insert chunks first.")
else:
    # 4. Perform query
    query = "Ẩm thực Hà Nội"
    query_emb = model.encode([query], convert_to_numpy=True, normalize_embeddings=True)
    results = collection.query(query_embeddings=query_emb.tolist(), n_results=3)

    # 5. Check results
    if not results["documents"]:
        print("❌ No matching results found.")
    elif not results['metadatas']:
        print("❌ No metadata found for query.")
    else:
        for doc, meta in zip(results['documents'][0], results['metadatas'][0]):
            print(f"Title: {meta['title']}, Chunk: {doc}")
```

---

## 📂 Directory Structure

```
chroma_server/
├── .venv/                  # Virtual environment
├── chroma-data/            # Chroma vector database (persistent)
├── etl/                    # ETL pipeline
│   ├── __init__.py
│   ├── chunking.py
│   ├── config.py
│   ├── database.py
│   ├── embedding.py
│   ├── main.py
│   ├── text_processing.py
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
├── .gitignore
├── return_etl.py           # Script to re-run ETL
├── posts.json              # Post json to run with arugement
├── test.py                 # Test scripts
└── README.md
```

---

## 🛠️ Troubleshooting

- **`ModuleNotFoundError: No module named 'etl'`**:

  - Run scripts with `python -m etl.main` instead of `python etl/main.py`.
  - Ensure you are in the `chroma_server` directory or add `sys.path.append` correctly.

- **Chroma has no data**:

  - Run `python return_etl.py` to populate the `blog_vi` collection.

- **ETL API errors**:

  - Test the ETL API:
    ```bash
    curl -X POST http://localhost:5001/etl/process -H "Content-Type: application/json" -d '{"action":"upsert","post":{"post_id":"123","title":"Test","slug":"test","content":"Hello"}}'
    ```

- **Backend API errors**:
  - Ensure the backend is running (`http://localhost:3000/api/posts`).
  - Check authentication (JWT token) for protected routes.

---

## 📜 License

MIT License © 2025
