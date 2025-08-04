// AiService.jsx
import axios from "axios";

const API_KEY = import.meta.env.VITE_GOOGLE_AI_KEY;

export async function generateText(prompt) {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            }
        );
        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    } catch (error) {
        console.error(error);
        throw error;
    }
}
