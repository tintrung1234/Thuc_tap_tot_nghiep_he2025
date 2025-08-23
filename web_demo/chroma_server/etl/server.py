from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import chromadb
from embedding import embed_batches  # file embed sẵn của bạn

app = FastAPI()

# --- Global variables ---
collection = None
model = None


class QueryRequest(BaseModel):
    query: str
    top_k: int = 5


# --- Server startup event ---
@app.on_event("startup")
def startup_event():
    global collection, model

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
@app.post("/query")
def query_docs(req: QueryRequest):
    try:
        global collection, model

        if collection is None or model is None:
            return {"error": "Server chưa sẵn sàng. Hãy thử lại sau"}

        # 1. Encode query
        query_emb = embed_batches(model, [req.query], batch_size=1)

        # 2. Query Chroma
        results = collection.query(
            query_embeddings=query_emb,  # không lấy [0]
            n_results=req.top_k,
            include=["documents", "metadatas", "distances"],
        )

        docs = results.get("documents") or [[]]
        metas = results.get("metadatas") or [[]]
        dists = results.get("distances") or [[]]

        # Lấy list đầu tiên, nếu rỗng thì cho []
        context_chunks = docs[0] if len(docs) > 0 else []
        context_text = " ".join(context_chunks) if context_chunks else ""

        return {
            "query": req.query,
            "context": context_text,
            "chunks": context_chunks,
            "metadatas": metas[0] if metas and len(metas) > 0 else [],
            "distances": dists[0] if dists and len(dists) > 0 else [],
        }
    except Exception as e:
        print("❌ Error in /query:", e)  # in ra console
        raise HTTPException(status_code=500, detail=str(e))
