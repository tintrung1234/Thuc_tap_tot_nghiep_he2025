# 📌 Blog Search Frontend

This is the frontend for a blog search application with intelligent search capabilities powered by Retrieval-Augmented Generation (RAG) via a Node.js backend. Built with React and Vite, it provides a responsive UI with rich text editing, post statistics visualization, and smooth animations.

## 🚀 Technologies Used

- **React**: JavaScript library for building user interfaces.
- **Vite**: Next-generation build tool for fast development and bundling.
- **Tailwind CSS**: Utility-first CSS framework for rapid and responsive design.
- **React Router DOM**: Client-side routing for seamless navigation.
- **Quill**: Rich text editor for post content creation.
- **Chart.js with react-chartjs-2**: Visualization of post statistics (e.g., views, engagement).
- **AOS (Animate on Scroll)**: Scroll animations for enhanced UX.
- **React Icons**: Social media and other icons for UI elements.
- **Axios**: HTTP client for API requests to the backend.

## 📂 Project Structure

```
client/
├── public/                    # Static assets (e.g., favicon, images)
├── src/                       # Source code
│   ├── admin/                 # Admin system administrator
│   ├── assets/                # Images, fonts, and other assets
│   ├── components/            # Reusable UI components (e.g., SearchBar, BlogPost)
│   ├── layouts/               # Sser and administration layout
│   ├── middleware/            # User authentication middleware
│   ├── pages/                 # Page components (e.g., SearchResultsPage)
│   ├── services/              # AI servives
│   ├── style/                 # Style css
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point for React
│   ├── index.css              # Global styles (Tailwind)
├── .env                       # Environment variables (ignored)
├── .gitignore                 # Git ignore file
├── package.json               # Project metadata and dependencies
├── package-lock.json          # Lock file for dependencies
├── vite.config.js             # Vite configuration
└── README.md                  # Project documentation
```

## ⚙️ Setup and Installation

1. **Prerequisites** 🔧:

   - Node.js (v16 or higher)
   - Backend server (running at `API_URL`, e.g., `http://localhost:3000/api`)
   - Chroma server (running at `http://localhost:8000`)
   - Ollama server (running at `http://localhost:11434` with `llama3`)
   - Python ETL server (running at `http://localhost:5001`)

2. **Install Dependencies** 📦:

   ```bash
   cd client
   npm install
   ```

3. **Environment Variables** 🌍:
   Create a `.env` file in the `client` directory with the following variables:

   ```env
   VITE_GOOGLE_AI_KEY=
   VITE_API_URL=
   ```

   - **VITE_GOOGLE_AI_KEY**: API key for Google AI services (e.g., for future integrations).
   - **VITE_API_URL**: Backend API endpoint for posts, search, and authentication.

## 🏃 Running the Application

1. **Start Backend** 🚀:

   ```bash
   cd ../client
   node server.js
   ```

2. **Start Chroma Server** 📊:

   ```bash
   cd ../chroma_server
   chroma run --path ./chroma-data --port 8000
   ```

3. **Start Ollama** 🤖:

   ```bash
   ollama run llama3
   ```

4. **Start ETL API** 🛠️:

   ```bash
   cd ../chroma_server
   python -m etl.main
   ```

5. **Start Frontend** ⚛️:
   ```bash
   cd client
   npm run dev
   ```
   - Runs at `http://localhost:5173` (default Vite port).

## 🔐 Authentication

- The frontend integrates with the backend's JWT authentication:
  - Login via `POST /api/users/login` to obtain a token.
  - Store token in localStorage or state management (e.g., Redux) for protected routes (e.g., creating posts).
- Example login request:
  ```bash
  curl -X POST http://localhost:5000/api/users/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}'
  ```
- Use token in API requests:
  ```javascript
  axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  ```

## 🔍 Features

- **Intelligent Search**: Uses RAG (Retrieval-Augmented Generation) via `/api/search` to display relevant chunks and LLM-generated answers for queries.
- **Post Management** ✍️: Create/edit posts with Quill editor, upload images via Cloudinary.
- **Statistics Visualization**: Display post views/engagement with Chart.js.
- **Responsive Design**: Tailwind CSS for mobile-friendly UI.
- **Animations**: AOS for smooth scroll animations.
- **Routing**: React Router DOM for seamless page navigation.

## 🌐 API Integration

### POST `/api/search`

- Fetches RAG results (chunks and LLM answer).
- Example:
  ```javascript
  axios
    .post(`${import.meta.env.VITE_API_URL}/search`, { query: "Ẩm thực Hà Nội" })
    .then((res) => console.log(res.data.chunks, res.data.answer));
  ```

### GET `/api/posts`

- Fetches posts with filters (e.g., `status=published`, `isDeleted=false`).
- Example:
  ```javascript
  axios
    .get(
      `${import.meta.env.VITE_API_URL}/posts?status=published&isDeleted=false`
    )
    .then((res) => console.log(res.data));
  ```

### POST `/api/posts`

- Creates a post (requires authentication and image upload).
- Example:
  ```javascript
  const formData = new FormData();
  formData.append("title", "Test Post");
  formData.append("image", imageFile);
  axios.post(`${import.meta.env.VITE_API_URL}/posts`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  ```

## 🐞 Debugging

- **Backend Connection**: Ensure `API_URL` is correct (`http://localhost:5000/api`).
- **Authentication**: Verify JWT token validity and `Authorization` header.
- **Chroma**: Check collection `blog_vi` (`curl http://localhost:8000/api/v1/collections`).
- **Ollama**: Test LLM (`curl http://localhost:11434/api/generate -d '{"model":"llama3","prompt":"Test"}'`).
- **ETL API**: Test endpoint (`curl -X POST http://localhost:5001/etl/process -H "Content-Type: application/json" -d '{"action":"upsert","post":{"post_id":"123","title":"Test","slug":"test","content":"Hello"}}'`).
- **Cloudinary**: Verify image uploads in Cloudinary dashboard.
- **Logs**: Check browser console or Vite dev server logs.

## 🔮 Future Improvements

- Add state management (e.g., Redux) for user sessions.
- Implement lazy loading for images and components.
- Enhance RAG UI with real-time query suggestions.
- Deploy with Vercel or Netlify for production.

## 📜 License

MIT License © 2025
