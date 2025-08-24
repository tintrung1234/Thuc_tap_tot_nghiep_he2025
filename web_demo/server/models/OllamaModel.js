const { Ollama } = require("@langchain/ollama");

class OllamaModel {
  constructor() {
    this.llm = new Ollama({
      baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
      model: process.env.OLLAMA_MODEL || "llama3",
    });
  }

  async generate(prompt) {
    const response = await this.llm.call(prompt);
    return response;
  }
}

module.exports = new OllamaModel();
