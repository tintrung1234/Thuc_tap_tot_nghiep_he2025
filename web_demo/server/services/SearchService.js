const ChromaModel = require("../models/ChromaModel");
const OllamaModel = require("../models/OllamaModel");

class SearchService {
  constructor() {
    this.embedder = null;
    this._init();
  }

  async _init() {
    const { pipeline } = await import("@xenova/transformers");
    this.embedder = await pipeline(
      "feature-extraction",
      process.env.EMBED_MODEL || "Xenova/paraphrase-multilingual-MiniLM-L12-v2"
    );
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
      .map((doc, index) => `Nội dung bài viết ${index + 1}: ${doc}`)
      .join("\n");

    const prompt = `Bạn là trợ lý AI cho một blog. Hãy trả lời CHÍNH XÁC dựa trên ngữ cảnh.
                Nếu không có thông tin trong ngữ cảnh, hãy trả lời: "Tôi không biết từ nội dung blog."
                ---------------- NGỮ CẢNH ----------------
                ${context}
                -----------------------------------------
                Câu hỏi: ${query}
                Yêu cầu: trả lời ngắn gọn, bằng tiếng Việt, có trích dẫn nguồn (slug/tiêu đề nếu có).`;

    // Generation từ LLM
    const answer = await OllamaModel.generate(prompt);

    return {
      chunks: results.documents[0].map((doc, index) => ({
        content: doc,
        metadata: results.metadatas[0][index],
      })),
      answer: answer.text || answer,
    };
  }
}

module.exports = new SearchService();
