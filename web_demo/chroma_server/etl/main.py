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
    name=cfg.collection, metadata={"hnsw:space": "cosine"})

# Embedding model
print("Tải model:", cfg.embed_model)
model = SentenceTransformer(cfg.embed_model)
counter = TokenCounter(model)


<<<<<<< HEAD
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--post-id", default=None, help="ID bài viết cụ thể để xử lý (upsert/delete)"
    )
    parser.add_argument(
        "--action",
        choices=["upsert", "delete"],
        default="upsert",
        help="Hành động: upsert hoặc delete",
    )
    parser.add_argument("--mongo-uri", default=None, help="MongoDB URI")
    parser.add_argument("--mongo-db", default=None, help="MongoDB database name")
    parser.add_argument(
        "--mongo-collection", default=None, help="MongoDB collection name"
    )
    parser.add_argument("--collection", default=None, help="Chroma collection name")
    parser.add_argument("--model", default=None, help="Embedding model")
    parser.add_argument(
        "--max-tokens", type=int, default=None, help="Max tokens per chunk"
    )
    parser.add_argument("--overlap", type=int, default=None, help="Overlap tokens")
    parser.add_argument(
        "--batch-size", type=int, default=None, help="Batch size for embedding"
    )
    parser.add_argument("--chroma-path", default=None, help="Chroma database path")
=======
@app.route('/etl/process', methods=['POST'])
def process_etl():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"status": "error", "message": "Body phải là JSON"}), 400
>>>>>>> 8c85f0795c53fce17d374f036feaa43385697a02

    action = data.get('action')
    post = data.get('post')

    if not action or not post:
        return jsonify({"status": "error", "message": "Thiếu action hoặc post data"}), 400

<<<<<<< HEAD
    # Chroma local
    client = chromadb.PersistentClient(path=cfg.chroma_path)
    try:
        collection = client.get_collection(cfg.collection)
    except Exception:
        collection = client.create_collection(
            cfg.collection, metadata={"hnsw:space": "cosine"}
        )
=======
    if action == 'upsert':
        num_chunks = upsert_post(post, model, counter, collection, cfg)
        return jsonify({"status": "success", "message": f"Upsert {num_chunks} chunks cho post {post.get('post_id')}"}), 200
>>>>>>> 8c85f0795c53fce17d374f036feaa43385697a02

    elif action == 'delete':
        post_id = post.get("post_id")
        num_deleted = delete_post_chunks(post_id, collection)
        return jsonify({"status": "success", "message": f"Deleted {num_deleted} chunks cho post {post_id}"}), 200

<<<<<<< HEAD
    # MongoDB client
    mongo_client = pymongo.MongoClient(cfg.mongo_uri)

    if args.post_id:
        # Xử lý một bài viết cụ thể
        db = mongo_client[cfg.mongo_db]
        post_collection = db[cfg.mongo_collection]
        post = post_collection.find_one({"_id": ObjectId(args.post_id)})

        if not post:
            print(f"Không tìm thấy bài viết với ID {args.post_id}")
            return

        if (
            args.action == "upsert"
            and post.get("status") == "published"
            and not post.get("isDeleted", False)
        ):
            print(f"Upsert bài viết {args.post_id}...")
            num_chunks = upsert_post(post, model, counter, collection, cfg)
            print(f"Đã upsert {num_chunks} chunks cho bài viết {args.post_id}")
        elif args.action == "delete":
            print(f"Xóa chunks của bài viết {args.post_id}...")
            num_deleted = delete_post_chunks(args.post_id, collection)
            print(f"Đã xóa {num_deleted} chunks cho bài viết {args.post_id}")
    else:
        # Xử lý tất cả bài viết published
        print("Xử lý tất cả bài viết published...")
        num_posts, num_chunks = 0, 0
        for post in tqdm(
            iter_posts_from_mongo(mongo_client, cfg.mongo_db, cfg.mongo_collection),
            desc="Posts",
            unit="post",
        ):
            num_posts += 1
            num_chunks += upsert_post(post, model, counter, collection, cfg)

        print(
            f"✓ Hoàn tất: {num_posts} posts -> {num_chunks} chunks → upsert vào collection '{cfg.collection}'."
        )

    mongo_client.close()
=======
    else:
        return jsonify({"status": "error", "message": "Invalid action"}), 400
>>>>>>> 8c85f0795c53fce17d374f036feaa43385697a02


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
