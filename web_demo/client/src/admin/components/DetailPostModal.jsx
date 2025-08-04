import React from "react";

function DetailPostModal({
  showDetailPostModal,
  setShowDetailPostModal,
  currentPost,
  openEditPostModal,
  handleDeletePost,
}) {
  if (!showDetailPostModal || !currentPost) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Chi tiết bài viết</h2>
        <div
          className="max-h-[70vh] overflow-y-auto"
          style={{ maxHeight: "70vh" }} // Fallback for older browsers
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tiêu đề
            </label>
            <p className="mt-1 p-2 border rounded w-full">
              {currentPost.title}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tác giả
            </label>
            <p className="mt-1 p-2 border rounded w-full">
              {currentPost.author}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Ngày đăng
            </label>
            <p className="mt-1 p-2 border rounded w-full">{currentPost.date}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <p className="mt-1 p-2 border rounded w-full">
              {currentPost.category}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tag
            </label>
            <p className="mt-1 p-2 border rounded w-full">
              {currentPost.tags.join(", ")}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nội dung
            </label>
            <div
              className="mt-1 p-2 border rounded w-full max-h-[30vh] overflow-y-auto"
              style={{ maxHeight: "30vh" }} // Fallback for older browsers
              dangerouslySetInnerHTML={{ __html: currentPost.content }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setShowDetailPostModal(false)}
            >
              Đóng
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => openEditPostModal(currentPost)}
            >
              Sửa
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleDeletePost(currentPost.id)}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPostModal;
