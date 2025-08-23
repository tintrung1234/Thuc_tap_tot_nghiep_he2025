from .chunking import TokenCounter
from .database import upsert_post, delete_post_chunks
from .config import Config
from sentence_transformers import SentenceTransformer
import chromadb
from flask import Flask, request, jsonify

#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Flask API để nhận dữ liệu bài viết từ backend NodeJS và chạy ETL (upsert/delete vào Chroma)
"""

app = Flask(__name__)

# Load config
cfg = Config.from_env()

# Chroma client
client = chromadb.PersistentClient(path=cfg.chroma_path)
collection = client.get_or_create_collection(
    name=cfg.collection, metadata={"hnsw:space": "cosine"}
)

# Embedding model
print("Tải model:", cfg.embed_model)
model = SentenceTransformer(cfg.embed_model)
counter = TokenCounter(model)


@app.route("/etl/process", methods=["POST"])
def process_etl():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"status": "error", "message": "Body phải là JSON"}), 400

    action = data.get("action")
    post = data.get("post")

    if not action or not post:
        return (
            jsonify({"status": "error", "message": "Thiếu action hoặc post data"}),
            400,
        )

    if action == "upsert":
        num_chunks = upsert_post(post, model, counter, collection, cfg)
        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Upsert {num_chunks} chunks cho post {post.get('post_id')}",
                }
            ),
            200,
        )

    elif action == "delete":
        post_id = post.get("post_id")
        num_deleted = delete_post_chunks(post_id, collection)
        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Deleted {num_deleted} chunks cho post {post_id}",
                }
            ),
            200,
        )

    else:
        return jsonify({"status": "error", "message": "Invalid action"}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
