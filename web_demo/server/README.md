# Blog Search Backend

This is a backend for a blog search application with intelligent search capabilities powered by Retrieval-Augmented Generation (RAG) using the Chroma vector database and Ollama LLM. The backend is built with Node.js, Express and Mongoose, integrates JWT authentication for secure access and communicates with a Python ETL pipeline to index blog posts into Chroma.

## Table of Contents

- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Authentication](#authentication)
- [API Endpoints Feature](#api-endpoints-feature)
- [ETL Integration](#etl-integration)
- [RAG Search](#rag-search)
- [Debugging](#debugging)
- [Future Improvements](#future-improvements)
- [License](#license)

## Technologies

- **Node.js**: JavaScript runtime for server-side logic.
- **Express**: Web framework for building RESTful APIs.
- **Mongoose**: ODM for MongoDB to manage data models (Post, Category, Tag).
- **Multer**: Middleware for handling file uploads (e.g., post images).
- **JWT**: JSON Web Token for user authentication.
- **Cloudinary**: Cloud service for storing and serving post images.
- **ChromaDB**: Vector database for storing and querying blog post embeddings.
- **Ollama**: Local LLM (LLaMA3) for generating natural language answers in RAG.
- **@xenova/transformers**: Embedding model for query vectorization.
- **LangChain**: Framework for building RAG pipeline.
- **Axios**: HTTP client for communicating with ETL API.
- **CORS**: Middleware for enabling cross-origin requests.

## Project Structure

├── config/
├── controllers/
├── middlewares/
├── models/
├── node_modules/ 🚫 (auto-hidden)
├── routes/
├── services/
├── uploads/ 🚫 (auto-hidden)
├── .env 🚫 (auto-hidden)
├── .gitignore
├── README.md
├── app.js
├── package-lock.json
├── package.json
└── server.js

## Setup and Installation

1. **Prerequisites**:

   - Node.js (v16 or higher)
   - MongoDB Atlas or local MongoDB (accessible via `MONGODB_URI`)
   - Chroma server (running at `CHROMA_HOST:CHROMA_PORT`)
   - Ollama server (running at `OLLAMA_BASE_URL` with LLaMA3 model)
   - Python ETL server (running at `ETL_API_URL`)
   - Cloudinary account for image uploads

2. **Install Dependencies**:

   ```bash
   cd server
   npm install
   ```

3. **MongoDB Setup**:
   - Connect to MongoDB using the provided `MONGODB_URI` (e.g., MongoDB Atlas).
   - Example data for `blog_db.posts`:
     ```javascript
     use blog_db;
     db.posts.insertOne({
       uid: new ObjectId(),
       title: "Giới thiệu Hà Nội",
       slug: "gioi-thieu-ha-noi",
       description: "Thủ đô Việt Nam",
       content: "<p>Hà Nội là thủ đô của Việt Nam. Thành phố này có lịch sử hơn 1000 năm.</p>",
       imageUrl: "https://res.cloudinary.com/daeorkmlh/image/upload/...",
       category: new ObjectId(),
       tags: [],
       status: "published",
       views: 0,
       isDeleted: false
     });
     ```

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

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

# MongoDB & Authentication

MONGODB_URI= # MongoDB connection string
JWT_SECRET= # Secret key for JWT authentication

# Cloudinary (for image hosting)

CLOUDINARY_CLOUD_NAME= # Cloudinary account name
CLOUDINARY_API_KEY= # Cloudinary API key
CLOUDINARY_API_SECRET= # Cloudinary API secret

# Express Server

PORT= # Port for the Express server

# Chroma Vector Database

CHROMA_HOST= # Host of the Chroma vector database
CHROMA_PORT= # Port of the Chroma vector database
CHROMA_SSL= # Enable SSL (true/false)
CHROMA_COLLECTION= # Name of the Chroma collection
CHROMA_PATH= # Directory for storing Chroma data

# Embedding & Chunking

EMBED_MODEL= # Sentence-Transformers model for embeddings
MAX_TOKENS= # Maximum tokens per text chunk
OVERLAP= # Token overlap between chunks
BATCH_SIZE= # Batch size for embedding

# Ollama (LLM service)

OLLAMA_BASE_URL= # Base URL of the Ollama server
OLLAMA_MODEL= # LLM model used by Ollama

# APIs

BACKEND_API_URL= # NodeJS backend API for fetching posts
ETL_API_URL= # Flask ETL API endpoint for upsert/delete

## Running the Application

1. **Start MongoDB**:

   - Make sure MongoDB Atlas can access or run the MongoDB dataset.

2. **Start Chroma Server**:

   ```bash
   cd ../chroma_server
   chroma run --path ./chroma-data --port 8000
   ```

3. **Start Ollama**:

   ```bash
   ollama run llama3
   ```

4. **Start ETL API**:

   ```bash
   cd ../chroma_server
   python -m etl.main
   ```

5. **Start Backend**:

   ```bash
   cd server
   node server.js
   ```

   - Server runs at `http://localhost:3000`.

6. **Start Frontend** (optional):
   ```bash
   cd ../client
   npm run dev
   ```

## Authentication

- The backend uses JWT for authentication. Protected endpoints (e.g., `/api/posts`) require a Bearer token in the `Authorization` header.
- **Login**:
  - Endpoint: `POST /api/users/login`
  - Request:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - Response:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
- **Usage**: Include token in requests:
  ```bash
  curl -H "Authorization: Bearer <token>" http://localhost:3000/api/posts
  ```

## API Endpoints Feature

### POST `/api/search`

- **Description**: Performs intelligent search using RAG (Retrieval-Augmented Generation).
- **Request Body**:
  ```json
  {
    "query": "Ẩm thực Hà Nội là gì?"
  }
  ```
- **Response**:
  ```json
  {
    "chunks": [
      {
        "content": "Phở là món ăn nổi tiếng ở Hà Nội.",
        "metadata": {
          "post_id": "123",
          "title": "Ẩm thực Hà Nội",
          "url": "/posts/am-thuc-ha-noi",
          "chunk_index": 0,
          "char_start": 0,
          "char_end": 50,
          "hash": "abc123..."
        }
      }
    ],
    "answer": "Phở là món ăn nổi tiếng nhất ở Hà Nội, thường được ăn vào bữa sáng."
  }
  ```

## ETL Integration

- The backend integrates with a Python ETL pipeline (running at `ETL_API_URL`).
- On post save (`Post.js` middleware), it sends post data to the ETL API for indexing into Chroma:
  - Action: `upsert` for published posts, `delete` for others.
- To re-run ETL for all posts:
  ```bash
  cd ../chroma_server
  python rerun_etl.py
  ```

## RAG Search

- The `/api/search` endpoint uses a Retrieval-Augmented Generation (RAG) pipeline:
  1. **Embedding**: Query is embedded using `EMBED_MODEL` (Xenova/paraphrase-multilingual-MiniLM-L12-v2).
  2. **Retrieval**: Top-3 chunks are retrieved from Chroma (`COLLECTION_NAME`).
  3. **Generation**: Ollama (`OLLAMA_MODEL`) generates a natural language answer based on chunks.
- The response includes both chunks (for context) and the LLM-generated answer.

## Debugging

- **MongoDB**: Verify `MONGODB_URI` connection with MongoDB Atlas or local instance.
- **Chroma**: Check server status (`curl http://localhost:8000/api/v1/collections`).
- **Ollama**: Test LLM (`curl http://localhost:11434/api/generate -d '{"model":"llama3","prompt":"Test"}'`).
- **ETL API**: Test endpoint (`curl -X POST http://localhost:5001/etl/process -H "Content-Type: application/json" -d '{"action":"upsert","post":{"post_id":"123","title":"Test","slug":"test","content":"Hello"}}'`).
- **JWT**: Ensure valid token for protected routes.
- **Cloudinary**: Verify `CLOUDINARY_*` credentials for image uploads.
- **Logs**: Check console for errors in `app.js` or `etl/server.py`.

## Future Improvements

- Add rate limiting for API endpoints.
- Implement RabbitMQ for async ETL processing.
- Optimize RAG with custom prompt templates.
- Deploy with Docker Compose for production.

## License

MIT License © 2025
