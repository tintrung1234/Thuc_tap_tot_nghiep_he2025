const { ChromaClient } = require("chromadb");

class ChromaModel {
  constructor() {
    this.client = new ChromaClient({ path: "http://localhost:8000" });
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
