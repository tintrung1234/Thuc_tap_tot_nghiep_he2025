import React, { useState, useEffect } from "react";
import Editor from "../../components/Editor"; // Import the Editor component
import "quill/dist/quill.snow.css";
import axios from "axios";

function EditPostModal({
  showEditPostModal,
  setShowEditPostModal,
  currentPost,
  handleEditPost,
}) {
  const [postData, setPostData] = useState({
    title: "",
    tags: [],
    description: "",
    category: "",
  });
  // eslint-disable-next-line no-unused-vars
  const [availableTags, setAvailableTags] = useState([
    "Experience",
    "Screen",
    "Marketing",
    "Life",
    "Technology",
    "Business",
  ]);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        // const tags = [
        //   ...new Set(res.data.flatMap((post) => post.tags || [])),
        // ].sort();
        const categories = [
          ...new Set(res.data.map((post) => post.category).filter(Boolean)),
        ].sort();
        // setAvailableTags(tags);
        setAvailableCategories(categories);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tags và categories:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (currentPost) {
      console.log("Current post data:", currentPost);
      setPostData({
        title: currentPost.title || "",
        tags: currentPost.tags || [],
        description: currentPost.description || "",
        category: currentPost.category || "",
      });
    }
  }, [currentPost]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "tags") {
      const tag = value;
      setPostData((prev) => {
        if (checked) {
          return { ...prev, tags: [...prev.tags, tag] };
        } else {
          return { ...prev, tags: prev.tags.filter((t) => t !== tag) };
        }
      });
    } else {
      setPostData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onContentChange = (htmlContent) => {
    setPostData((prev) => ({ ...prev, description: htmlContent }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditPost(e, postData);
  };

  if (!showEditPostModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa bài viết</h2>
        <form onSubmit={handleSubmit}>
          <div
            className="max-h-[70vh] overflow-y-auto"
            style={{ maxHeight: "70vh" }}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tiêu đề</label>
              <input
                type="text"
                name="title"
                value={postData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Tag (chọn nhiều)
              </label>
              <div className="grid grid-cols-2 gap-2 p-2 border rounded h-32 overflow-y-auto">
                {availableTags.map((tag) => (
                    <label key={tag} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="tags"
                        value={tag}
                        checked={postData.tags.includes(tag)}
                        onChange={handleChange}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}

              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <select
                name="category"
                value={postData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Chọn danh mục</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nội dung</label>
              <Editor value={postData.description} onChange={onContentChange} />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setShowEditPostModal(false)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPostModal;
