import React, { useState, useEffect } from "react";
import Editor from "../../components/Editor"; // Import the Editor component
import "quill/dist/quill.snow.css";

function EditPostModal({
  showEditPostModal,
  setShowEditPostModal,
  currentPost,
  handleEditPost,
  categories,
  tags,
}) {
  const [postData, setPostData] = useState({
    title: "",
    category: "",
    tags: [],
    description: "",
    content: "",
  });

  useEffect(() => {
    if (currentPost) {
      setPostData({
        title: currentPost.title || "",
        category: currentPost.category?._id || "",
        tags: currentPost.tags.map((tag) => tag._id || tag) || [],
        description: currentPost.description || "",
        content: currentPost.content || "",
      });
    }
  }, [currentPost]);

  // Close modal on Esc key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowEditPostModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setShowEditPostModal]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "tags") {
      setPostData((prev) => {
        if (checked) {
          return { ...prev, tags: [...prev.tags, value] };
        } else {
          return { ...prev, tags: prev.tags.filter((t) => t !== value) };
        }
      });
    } else {
      setPostData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleContentChange = (htmlContent) => {
    setPostData((prev) => ({ ...prev, content: htmlContent }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditPost(e, postData);
  };

  if (!showEditPostModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-purple-700 mb-4">
          Chỉnh sửa bài viết
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề
              </label>
              <textarea
                type="text"
                name="title"
                value={postData.title}
                onChange={handleChange}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                rows={1}
                aria-label="Tiêu đề bài viết"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                name="category"
                value={postData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Chọn danh mục cho bài viết"
              >
                <option hidden value="">
                  --Chọn danh mục--
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag (chọn nhiều)
              </label>
              <div className="grid grid-cols-2 gap-2 p-3 border border-gray-200 rounded-md max-h-32 overflow-y-auto bg-gray-50">
                {tags.map((tag) => (
                  <label key={tag._id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="tags"
                      value={tag._id}
                      checked={postData.tags.includes(tag._id)}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={postData.description}
                type="text"
                name="description"
                onChange={handleChange}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung
              </label>
              <Editor value={postData.content} onChange={handleContentChange} />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              onClick={() => setShowEditPostModal(false)}
              aria-label="Hủy chỉnh sửa bài viết"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              aria-label="Lưu bài viết đã chỉnh sửa"
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
