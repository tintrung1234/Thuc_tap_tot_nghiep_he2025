const axios = require("axios");

async function searchDoc(query) {
    try {
        const response = await axios.post("http://localhost:8000/query", {
            query: query,
            top_k: 5
        });

        const data = response.data;
        return data;

    } catch (error) {
        if (error.response) {
            // Lỗi từ server (HTTP 4xx, 5xx)
            console.error("Server error:", error.response.status, error.response.data);
            return { error: error.response.data };
        } else if (error.request) {
            // Không kết nối được server
            console.error("No response from server:", error.request);
            return { error: "No response from server" };
        } else {
            // Lỗi config axios
            console.error("Axios error:", error.message);
            return { error: error.message };
        }
    }
}

module.exports = searchDoc;
