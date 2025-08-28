# 📌 WebBlog Search with Vietnamese NLP and RAG

This project builds an **intelligent blog search system** for Vietnamese content, leveraging **Retrieval-Augmented Generation (RAG)** with Chroma vector database and Ollama LLM. It includes a **React frontend**, a **Node.js/Express backend**, and a **Python ETL pipeline** for indexing blog posts into ChromaDB. The system supports rich text editing, post statistics visualization, and secure authentication.

## 🚀 Technologies Used

### Frontend ⚛️

## URL Frontend: https://vfriends.vercel.app

- **React**: JavaScript library for building user interfaces.
- **Vite**: Next-generation build tool for fast development and bundling.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **React Router DOM**: Client-side routing for seamless navigation.
- **Quill**: Rich text editor for post content creation.
- **Chart.js with react-chartjs-2**: Visualization of post statistics.
- **AOS (Animate on Scroll)**: Scroll animations for enhanced UX.
- **React Icons**: Social media and other icons.
- **Axios**: HTTP client for API requests.

### Backend 📟

## URL Backend: https://thuc-tap-tot-nghiep-he2025.onrender.com

- **Node.js**: JavaScript runtime for server-side logic.
- **Express**: Web framework for RESTful APIs.
- **Mongoose**: ODM for MongoDB to manage data models.
- **Multer**: Middleware for handling file uploads.
- **JWT**: JSON Web Token for authentication.
- **Cloudinary**: Cloud service for storing post images.
- **ChromaDB**: Vector database for embeddings.
- **Ollama**: Local LLM (LLaMA3) for RAG.
- **@xenova/transformers**: Embedding model for query vectorization.
- **LangChain**: Framework for RAG pipeline.
- **Axios**: HTTP client for ETL API.

### Chroma Server 🛠️

- **Python 3.11**: Core language for ETL pipeline.
- **ChromaDB**: Vector database for storing embeddings.
- **Sentence-Transformers**: Embedding generation.
- **underthesea**: Vietnamese NLP for sentence segmentation.
- **Flask**: API server for ETL processing.
- **Requests**: HTTP client for backend integration.

## 📂 Project Structure

```
web_demo/
├── server/                    # Node.js backend
│   ├── config/                # Database configuration
│   ├── controllers/           # API controllers
│   ├── middlewares/           # Authentication middleware
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── services/              # Business logic (e.g., RAG)
│   ├── uploads/               # Temporary file uploads (ignored)
│   ├── .env                   # Environment variables
│   ├── app.js                 # Express app entry
├── chroma_server/             # Python ETL pipeline
│   ├── etl/                   # ETL scripts
│   ├── chroma-data/           # Chroma vector database
│   ├── .env                   # Environment variables
│   ├── rerun_etl.py           # Script to re-run ETL
├── client/                    # React frontend
│   ├── src/                   # Source code
│   │   ├── assets/            # Images, fonts
│   │   ├── components/        # UI components
│   │   ├── pages/             # Page components
│   ├── .env                   # Environment variables
│   ├── vite.config.js         # Vite configuration
├── .gitignore                 # Git ignore file
└── README.md                  # Project documentation
```

## ⚙️ Setup and Installation

1. **Prerequisites** 🔧:

   - Node.js (v16 or higher)
   - Python 3.11
   - MongoDB Atlas (accessible via `MONGODB_URI`)
   - Chroma server (`CHROMA_HOST:CHROMA_PORT`)
   - Ollama server (`OLLAMA_BASE_URL` with `OLLAMA_MODEL`)
   - Cloudinary account for image uploads

2. **Clone the Repository** 📂:

   ```bash
   git clone https://github.com/tintrung1234/Thuc_tap_tot_nghiep_he2025.git
   cd web_demo
   ```

3. **Install Dependencies** 📦:
   - **Backend**:
     ```bash
     cd server
     npm install
     ```
   - **Frontend**:
     ```bash
     cd client
     npm install
     ```
   - **Chroma Server**:
     ```bash
     cd chroma_server
     python -m venv .venv
     source .venv/bin/activate  # Linux/macOS
     .venv\Scripts\activate     # Windows
     pip install -r requirements.txt
     ```

## 🌍 Environment Variables

### Backend (`server/.env`)

```env
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=
CHROMA_HOST=
CHROMA_PORT=
CHROMA_SSL=
COLLECTION_NAME=
OLLAMA_BASE_URL=
OLLAMA_MODEL=
EMBED_MODEL=
ETL_API_URL=
```

- **MONGODB_URI**: MongoDB Atlas connection string.
- **JWT_SECRET**: Secret key for JWT tokens.
- **CLOUDINARY_CLOUD_NAME**: Cloudinary cloud name for image storage.
- **CLOUDINARY_API_KEY**: Cloudinary API key.
- **CLOUDINARY_API_SECRET**: Cloudinary API secret.
- **PORT**: Express server port.
- **CHROMA_HOST**: Chroma server hostname.
- **CHROMA_PORT**: Chroma server port.
- **CHROMA_SSL**: Enable SSL for Chroma (true/false).
- **COLLECTION_NAME**: Chroma collection name.
- **OLLAMA_BASE_URL**: Ollama server URL.
- **OLLAMA_MODEL**: Ollama model (e.g., llama3).
- **EMBED_MODEL**: Sentence-Transformers model.
- **ETL_API_URL**: Python ETL API endpoint.

### Chroma Server (`chroma_server/.env`)

```env
CHROMA_COLLECTION=
MAX_TOKENS=
OVERLAP=
BATCH_SIZE=
CHROMA_PATH=
BACKEND_API_URL=
ETL_API_URL=
```

- **CHROMA_COLLECTION**: Chroma collection name.
- **EMBED_MODEL**: Sentence-Transformers model.
- **MAX_TOKENS**: Maximum tokens per chunk.
- **OVERLAP**: Token overlap between chunks.
- **BATCH_SIZE**: Batch size for embedding.
- **CHROMA_PATH**: Directory for Chroma data.
- **BACKEND_API_URL**: Backend API for fetching posts.
- **ETL_API_URL**: ETL Flask API endpoint.

### Frontend (`client/.env`)

```env
VITE_GOOGLE_AI_KEY=
VITE_API_URL=
```

- **VITE_GOOGLE_AI_KEY**: API key for Google AI services (future integrations).
- **API_URL**: Backend API endpoint.

## 🏃 Running the Application

1. **Start MongoDB Atlas** ☁️:

   - Ensure `MONGODB_URI` is accessible.

2. **Start Chroma Server** 📊:

   ```bash
   cd chroma_server
   chroma run --path ./chroma-data --port 8000
   ```

3. **Start Ollama** 🤖:

   ```bash
   ollama run llama3
   ```

4. **Start ETL API** 🛠️:

   ```bash
   cd chroma_server
   python -m etl.main
   ```

5. **Start Backend** 📟:

   ```bash
   cd server
   node server.js
   ```

6. **Start Frontend** ⚛️:
   ```bash
   cd client
   npm run dev
   ```

## 🔐 Authentication

- Uses JWT for secure access to protected endpoints (e.g., `POST /api/posts`).
- **Login**:
  ```bash
  curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}'
  ```
- **Usage**: Include token in requests:
  ```bash
  curl -H "Authorization: Bearer <token>" http://localhost:5000/api/posts
  ```

## 🔍 API Endpoints Feature

### POST `/api/search`

- Intelligent search with RAG.
- Request:
  ```json
  {
    "query": "Ẩm thực Hà Nội là gì?"
  }
  ```
- Response:
  ```json
  {
    "chunks": [
      {
        "content": "Phở là món ăn nổi tiếng ở Hà Nội.",
        "metadata": {
          "post_id": "123",
          "title": "Ẩm thực Hà Nội",
          "url": "/posts/am-thuc-ha-noi",
          "chunk_index": 0
        }
      }
    ],
    "answer": "Phở là món ăn nổi tiếng nhất ở Hà Nội, thường được ăn vào bữa sáng."
  }
  ```

## 🛠️ ETL Pipeline

- Located in `chroma_server/etl/`:
  - `text_processing.py`: Cleans HTML and segments text.
  - `chunking.py`: Splits text into chunks.
  - `embedding.py`: Generates embeddings.
  - `database.py`: Manages ChromaDB.
  - `main.py`: Flask API for ETL.
- Re-run ETL:
  ```bash
  cd chroma_server
  python return_etl.py
  ```

## 🤖 RAG Search

- Combines Chroma retrieval with Ollama (LLaMA3) for natural language answers.
- Frontend displays chunks and LLM answers for question-like queries.

## 🐞 Debugging

- **MongoDB**: Verify `MONGODB_URI` in Atlas.
- **Chroma**: Check `curl http://localhost:8000/api/v1/collections`.
- **Ollama**: Test `curl http://localhost:11434/api/generate -d '{"model":"llama3","prompt":"Test"}'`.
- **ETL API**: Test `curl -X POST http://localhost:5001/etl/process`.
- **JWT**: Ensure valid token.
- **Cloudinary**: Verify image uploads.
- **Frontend**: Check browser console and Vite logs.

## 🔮 Future Improvements

- Add Redux for state management.
- Implement RabbitMQ for async ETL.
- Optimize RAG with custom prompts.
- Deploy with Docker Compose, Vercel, or Netlify.

## 📜 License

MIT License © 2025



