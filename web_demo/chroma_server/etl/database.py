from typing import List, Tuple
import chromadb
import hashlib
from sentence_transformers import SentenceTransformer
from .text_processing import html_to_text
from .chunking import chunk_by_sentences, TokenCounter
from .embedding import embed_batches
from .config import Config


def sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def upsert_post(
    post: dict,
    model: SentenceTransformer,
    counter: TokenCounter,
    collection,
    cfg: Config,
):
    """Upsert một bài viết vào Chroma"""
    post_id = post.get("post_id")
    title = post.get("title", "")
    url = post.get("slug", "")
    content = post.get("content", "")
    text_clean = html_to_text(content) if content else ""

    if not text_clean:
        return 0

    chunks = chunk_by_sentences(text_clean, counter, cfg.max_tokens, cfg.overlap)
    if not chunks:
        return 0

    all_docs, all_metas, all_ids = [], [], []
    for idx, (chunk_text, (cstart, cend)) in enumerate(chunks):
        h = sha256(chunk_text)
        uid = f"{post_id}:{idx}:{h[:8]}"
        meta = {
            "post_id": post_id,
            "title": title,
            "url": f"/posts/{url}",
            "chunk_index": idx,
            "char_start": cstart,
            "char_end": cend,
            "hash": h,
        }
        all_ids.append(uid)
        all_docs.append(chunk_text)
        all_metas.append(meta)

    if all_docs:
        embeddings = embed_batches(model, all_docs, cfg.batch_size)

        # Debug sample
        import json

        print(
            "SAMPLE:",
            {
                "ids": all_ids[:1],
                "doc": str(all_docs[0])[:100],  # tránh in quá dài
                "emb_len": len(embeddings[0]),
                "meta": json.dumps(all_metas[0], ensure_ascii=False, default=str),
            },
        )

        collection.upsert(
            ids=all_ids,
            embeddings=embeddings,
            documents=all_docs,
            metadatas=all_metas,
        )
    return len(chunks)


def delete_post_chunks(post_id: str, collection):
    """Xóa chunks của bài viết khỏi Chroma"""
    try:
        results = collection.get(where={"post_id": post_id})
        if results["ids"]:
            collection.delete(ids=results["ids"])
        return len(results["ids"])
    except Exception as e:
        print(f"Error deleting chunks for post {post_id}: {e}")
        return 0
