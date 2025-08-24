const { ChromaClient } = require("chromadb");

class ChromaModel {
  constructor() {
    this.client = new ChromaClient({
      host: process.env.CHROMA_HOST || "localhost",
      port: Number(process.env.CHROMA_PORT) || 8000,
      ssl: process.env.CHROMA_SSL === "true",
    });

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
