// askController.js
const searchDocs = require("../services/chromaService.js");
const askLLM = require("../services/llmService.js");

async function handleAsk(req, res) {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ error: "Missing query" });

        // 1. Query Chroma
        const contextData = await searchDocs(query);

        // 2. Convert context thành text cho LLM
        if (contextData.chunks && contextData.chunks.length > 0) {
            context = contextData.chunks[0];
        }

        // 3. Gửi sang LLM
        const answer = await askLLM(context, query);

        res.json({ query, context, answer });
    } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        res.status(500).json({ error: err.response?.data || err.message });
    }
}

module.exports = handleAsk;
