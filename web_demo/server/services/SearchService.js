const { pipeline } = require("@xenova/transformers");
const ChromaModel = require("../models/ChromaModel");
const OllamaModel = require("../models/OllamaModel");

class SearchService {
  constructor() {
    this.embedder = null;
    (async () => {
      this.embedder = await pipeline(
        "feature-extraction",
        "Xenova/paraphrase-multilingual-MiniLM-L12-v2"
      );
    })();
  }

  async search(query) {
    if (!this.embedder) {
      throw new Error("Embedder not initialized");
    }

    // Embed query
    const embedding = await this.embedder(query, {
      pooling: "mean",
      normalize: true,
    });
    const queryEmbedding = Array.from(embedding.data);

    // Retrieval từ Chroma
    const results = await ChromaModel.query(queryEmbedding, 3);

    // Prompt cho RAG
    const context = results.documents[0]
      .map((doc, index) => `Chunk ${index + 1}: ${doc}`)
      .join("\n");
    const prompt = `Dựa trên nội dung sau bằng tiếng Việt: ${context}\nTrả lời câu hỏi: ${query}`;

    // Generation từ LLM
    const answer = await OllamaModel.generate(prompt);

    return {
      chunks: results.documents[0].map((doc, index) => ({
        content: doc,
        metadata: results.metadatas[0][index],
      })),
      answer: answer.text || answer, // Điều chỉnh tùy LLM response
    };
  }
}

module.exports = new SearchService();
