#!/usr/bin/env python
# -*- coding: utf-8 -*-

from tqdm import tqdm
from dotenv import load_dotenv
from pymongo import MongoClient
import sys
import os
import chromadb
from sentence_transformers import SentenceTransformer

from etl.chunking import TokenCounter
from etl.database import upsert_post, delete_post_chunks
from etl.config import Config


def main():
    load_dotenv()

    # Lấy thông tin kết nối Mongo từ .env
    mongo_uri = os.getenv("MONGO_URI")
    mongo_db = os.getenv("MONGO_DB")
    mongo_collection = os.getenv("MONGO_COLLECTION")

    if not mongo_uri or not mongo_db or not mongo_collection:
        print("❌ Error: Thiếu MONGO_URI / MONGO_DB / MONGO_COLLECTION trong .env")
        sys.exit(1)

    # Kết nối Mongo
    client_mongo = MongoClient(mongo_uri)
    db = client_mongo[mongo_db]
    posts_collection = db[mongo_collection]

    # Lấy config ETL
    cfg = Config.from_env()

    # Kết nối Chroma
    client_chroma = chromadb.PersistentClient(path=cfg.chroma_path)
    collection = client_chroma.get_or_create_collection(
        name=cfg.collection, metadata={"hnsw:space": "cosine"}
    )

    # Load model
    print("🚀 Tải model:", cfg.embed_model)
    model = SentenceTransformer(cfg.embed_model)
    counter = TokenCounter(model)

    # Query tất cả bài viết published + chưa bị xóa
    posts = list(posts_collection.find({
        "status": "published",
        "isDeleted": False
    }))

    if not posts:
        print("⚠️ Không có bài viết nào để xử lý.")
        return

    print(f"🔍 Tìm thấy {len(posts)} bài viết trong Mongo")

    # ETL từng bài
    total_chunks = 0
    for post in tqdm(posts, desc="Processing posts", unit="post"):
        post_data = {
            "post_id": str(post.get("_id")),
            "title": post.get("title", ""),
            "slug": post.get("slug", ""),
            "content": post.get("content", ""),
            "status": post.get("status", ""),
            "isDeleted": post.get("isDeleted", False),
        }

        try:
            if post_data["status"] == "published" and not post_data["isDeleted"]:
                num_chunks = upsert_post(
                    post_data, model, counter, collection, cfg
                )
                total_chunks += num_chunks
                print(
                    f"✅ Upsert {num_chunks} chunks cho post {post_data['post_id']}")
            else:
                num_deleted = delete_post_chunks(
                    post_data["post_id"], collection)
                print(
                    f"🗑 Deleted {num_deleted} chunks cho post {post_data['post_id']}")

        except Exception as e:
            print(f"❌ Error xử lý post {post_data['post_id']}: {e}")

    print(f"\n🎉 Hoàn tất: {len(posts)} posts → {total_chunks} chunks")


if __name__ == "__main__":
    main()
