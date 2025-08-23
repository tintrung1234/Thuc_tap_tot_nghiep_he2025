from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import chromadb
from embedding import embed_batches  # file embed sẵn của bạn

# --- Flask app ---
app = Flask(__name__)

# --- Global variables ---
collection = None
model = None


# --- Server startup ---
@app.before_request
def startup_event():
    global collection, model
    if collection is None or model is None:
        # Load Chroma collection
        client = chromadb.PersistentClient(path="../chroma-data")
        try:
            collection = client.get_collection("blog_vi")
        except Exception:
            collection = client.create_collection(
                "blog_vi", metadata={"hnsw:space": "cosine"}
            )

        # Load embedding model
        model = SentenceTransformer("keepitreal/vietnamese-sbert")
        print("✅ Collection & embedding model ready")


# --- Query endpoint ---
@app.route("/query", methods=["POST"])
def query_docs():
    global collection, model

    if collection is None or model is None:
        return jsonify({"error": "Server chưa sẵn sàng. Hãy thử lại sau"}), 503

    data = request.get_json(silent=True)
    if not data or "query" not in data:
        return jsonify({"error": "Body phải có query"}), 400

    query = data.get("query")
    top_k = int(data.get("top_k", 5))

    try:
        # 1. Encode query
        query_emb = embed_batches(model, [query], batch_size=1)

        # 2. Query Chroma
        results = collection.query(
            query_embeddings=query_emb,
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )

        docs = results.get("documents") or [[]]
        metas = results.get("metadatas") or [[]]
        dists = results.get("distances") or [[]]

        context_chunks = docs[0] if docs else []
        context_text = " ".join(context_chunks) if context_chunks else ""

        return jsonify(
            {
                "query": query,
                "context": context_text,
                "chunks": context_chunks,
                "metadatas": metas[0] if metas else [],
                "distances": dists[0] if dists else [],
            }
        )

    except Exception as e:
        print("❌ Error in /query:", e)
        return jsonify({"error": str(e)}), 500


# --- ETL endpoint ---
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

    try:
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

    except Exception as e:
        print("❌ Error in /etl/process:", e)
        return jsonify({"status": "error", "message": str(e)}), 500


# --- Run server ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
