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
      "Xenova/paraphrase-multilingual-MiniLM-L12-v2"
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

    const prompt = `Bạn là trợ lý chỉ được phép trả lời dựa trên CONTEXT sau. Nếu câu trả lời có trong CONTEXT, hãy trích nguyên văn hoặc diễn giải ngắn gọn. Nếu không có, hãy trả lời đúng câu: "Mình chưa thấy thông tin trong dữ liệu.Trả lời bằng tiếng Việt"
                CONTEXT:
                ${context}
                Câu hỏi: ${query}
                Trả lời:`;

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
