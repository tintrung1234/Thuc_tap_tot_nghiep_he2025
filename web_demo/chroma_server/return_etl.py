#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script để chạy lại ETL cho toàn bộ bài blog bằng cách gọi API backend để lấy dữ liệu,
sau đó gửi từng bài viết đến ETL API server để xử lý (upsert/delete vào Chroma).
"""
import os
import sys
import requests
from dotenv import load_dotenv
from tqdm import tqdm


def main():
    load_dotenv()
    backend_api_url = os.getenv("BACKEND_API_URL")
    etl_api_url = os.getenv("ETL_API_URL")

    if not backend_api_url or not etl_api_url:
        print("Error: Thiếu BACKEND_API_URL hoặc ETL_API_URL trong .env")
        sys.exit(1)

    try:
        # Lấy danh sách bài viết từ backend API
        response = requests.get(f"{backend_api_url}")
        response.raise_for_status()
        posts = response.json().get("posts", [])

        if not posts:
            print("Không có bài viết published nào để xử lý.")
            return

        # Xử lý từng bài viết
        num_posts = 0
        num_chunks = 0
        for post in tqdm(posts, desc="Processing posts", unit="post"):
            # Chuẩn bị dữ liệu gửi đến ETL API
            action = (
                "upsert"
                if post.get("status") == "published"
                and not post.get("isDeleted", False)
                else "delete"
            )

            post_data = {
                "post_id": str(post.get("_id")),
                "title": post.get("title", ""),
                "slug": post.get("slug", ""),
                "content": post.get("content", ""),
                "status": post.get("status", ""),
                "isDeleted": post.get("isDeleted", False),
                "category": post.get("category", {}),
                "tags": post.get("tags", []),
                "imageUrl": post.get("imageUrl", ""),
                "uid": post.get("uid", {}),
            }

            # Gửi yêu cầu đến ETL API
            try:
                response = requests.post(
                    etl_api_url, json={"action": action, "post": post_data}, timeout=30
                )
                response.raise_for_status()
                result = response.json()
                print(f"Post {post_data['post_id']}: {result['message']}")
                if action == "upsert" and result.get("status") == "success":
                    # Extract số chunks
                    try:
                        num_chunks += int(result["message"].split()[1])
                    except Exception:
                        pass
                num_posts += 1
            except requests.RequestException as e:
                print(f"Error processing post {post_data['post_id']}: {e}")

        print(f"✓ Hoàn tất: {num_posts} posts -> {num_chunks} chunks processed.")

    except requests.RequestException as e:
        print(f"Error fetching posts from backend: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
