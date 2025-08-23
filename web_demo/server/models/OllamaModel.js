const { Ollama } = require("@langchain/ollama");

class OllamaModel {
  constructor() {
    this.llm = new Ollama({
      baseUrl: "http://localhost:11434",
      model: "llama3", // Hoặc 'llama2'
    });
  }

  async generate(prompt) {
    const response = await this.llm.call(prompt);
    return response;
  }
}

module.exports = new OllamaModel();
