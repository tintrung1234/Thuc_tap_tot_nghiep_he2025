const { ChromaClient } = require("chromadb");

class ChromaModel {
  constructor() {
    // Xây dựng URL từ env
    const host = process.env.CHROMA_HOST || "localhost";
    const port = Number(process.env.CHROMA_PORT) || 8000; // Chroma mặc định 8000
    const ssl = process.env.CHROMA_SSL === "true";

    const url = `${ssl ? "https" : "http"}://${host}:${port}`;

    this.client = new ChromaClient({ path: url });
    console.log("Chroma client initialized with path:", url);

    this.collectionName = "blog_vi";
  }

  async getCollection() {
    return await this.client.getCollection({ name: this.collectionName });
  }

  async query(queryEmbedding, k = 3) {
    const collection = await this.getCollection();
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: k,
    });
    return results;
  }
}

module.exports = new ChromaModel();
