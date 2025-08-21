#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Pipeline: MongoDB posts -> clean -> sentence split (underthesea) -> chunk -> embed -> upsert/delete Chroma local
"""
import argparse
import chromadb
from sentence_transformers import SentenceTransformer
from tqdm import tqdm
import pymongo
from bson import ObjectId
from etl.config import Config
from etl.database import upsert_post, delete_post_chunks, iter_posts_from_mongo
from etl.chunking import TokenCounter


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

    args = parser.parse_args()
    cfg = Config.from_env_and_args(args)

    print("[CONFIG]", cfg)

    # Chroma local
    client = chromadb.PersistentClient(path=cfg.chroma_path)
    try:
        collection = client.get_collection(cfg.collection)
    except Exception:
        collection = client.create_collection(
            cfg.collection, metadata={"hnsw:space": "cosine"}
        )

    # Embedding model
    print("Tải model:", cfg.embed_model)
    model = SentenceTransformer(cfg.embed_model)
    counter = TokenCounter(model)

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


if __name__ == "__main__":
    main()
