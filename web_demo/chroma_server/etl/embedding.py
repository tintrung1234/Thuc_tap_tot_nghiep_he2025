from tqdm import tqdm
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List


def embed_batches(model: SentenceTransformer, texts: List[str], batch_size: int) -> List[np.ndarray]:
    embs = []
    for i in tqdm(range(0, len(texts), batch_size), desc="Embedding", unit="batch"):
        batch = texts[i:i+batch_size]
        v = model.encode(batch, convert_to_numpy=True,
                         normalize_embeddings=True)
        embs.extend(list(v))  # Trả về list[np.ndarray]
    return embs
