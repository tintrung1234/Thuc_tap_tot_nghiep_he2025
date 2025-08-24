#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Flask API để nhận dữ liệu bài viết từ backend NodeJS và chạy ETL (upsert/delete vào Chroma)
Hỗ trợ argument --post file.json để test nhanh ETL.
"""

import argparse
import json
from flask import Flask, request, jsonify
import chromadb
from sentence_transformers import SentenceTransformer
from .chunking import TokenCounter
from .database import upsert_post, delete_post_chunks
from .config import Config

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


def run_etl_from_file(file_path):
    """Chạy ETL trực tiếp từ file JSON (không cần gửi request)."""
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    action = data.get("action")
    post = data.get("post")

    if action == "upsert":
        num_chunks = upsert_post(post, model, counter, collection, cfg)
        print(
            f"[ETL] Upsert {num_chunks} chunks cho post {post.get('post_id')}")

    elif action == "delete":
        post_id = post.get("post_id")
        num_deleted = delete_post_chunks(post_id, collection)
        print(f"[ETL] Deleted {num_deleted} chunks cho post {post_id}")

    else:
        print("[ETL] Invalid action trong file JSON")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--post", type=str,
                        help="File JSON chứa dữ liệu post để test ETL")
    parser.add_argument("--port", type=int, default=5001,
                        help="Port để chạy Flask server")
    args = parser.parse_args()

    if args.post:
        run_etl_from_file(args.post)
    else:
        app.run(host="0.0.0.0", port=args.port, debug=True)
