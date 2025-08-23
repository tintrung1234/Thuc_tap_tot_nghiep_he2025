const axios = require("axios");

async function askLLM(context, query) {
    const url = "http://localhost:11434/api/chat"; // Ollama local endpoint

    const body = {
        model: "llama3",
        stream: false, // ⚡ QUAN TRỌNG: để nhận response 1 lần
        messages: [
            {
                role: "system",
                content: `Bạn là trợ lý chỉ được phép trả lời dựa trên CONTEXT sau.
                - Nếu câu trả lời có trong CONTEXT, hãy trích nguyên văn hoặc diễn giải ngắn gọn.
                - Nếu không có, hãy trả lời đúng câu: "Mình chưa thấy thông tin trong dữ liệu."
                CONTEXT:
                ${context}`,
            },
            {
                role: "user",
                content: query,
            },
        ],
    };

    const response = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" },
    });

    // Với stream: false, Ollama trả về { message: { role, content }, ... }
    return response.data.message.content;
}

module.exports = askLLM;
