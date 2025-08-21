// services/llmService.js
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const API_KEY = process.env.OPENROUTER_API_KEY;
if (!API_KEY) throw new Error("OPENROUTER_API_KEY chưa được set trong .env");

async function askLLM(context, query) {

    const url = "https://openrouter.ai/api/v1/chat/completions";
    const headers = {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
    };

    const body = {
        model: "deepseek/deepseek-chat-v3-0324:free", // hoặc model bạn chọn
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

    const response = await axios.post(url, body, { headers });
    return response.data.choices[0].message.content;
}

module.exports = askLLM;
