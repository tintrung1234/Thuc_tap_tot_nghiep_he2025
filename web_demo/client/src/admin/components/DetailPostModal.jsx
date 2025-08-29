import React, { useEffect } from "react";

function DetailPostModal({
  showDetailPostModal,
  setShowDetailPostModal,
  currentPost,
  openEditPostModal,
  handleDeletePost,
}) {
  // Close modal on Esc key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowDetailPostModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setShowDetailPostModal]);

  if (!showDetailPostModal || !currentPost) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-purple-700 mb-4">
          Chi tiết bài viết
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tiêu đề
            </label>
            <p className="mt-1 p-2 border border-gray-200 rounded bg-gray-50">
              {currentPost.title}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tác giả
            </label>
            <p className="mt-1 p-2 border border-gray-200 rounded bg-gray-50">
              {currentPost.author}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày đăng
            </label>
            <p className="mt-1 p-2 border border-gray-200 rounded bg-gray-50">
              {currentPost.date}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Danh mục
            </label>
            <p className="mt-1 p-2 border border-gray-200 rounded bg-gray-50">
              {currentPost.category?.name || "Chưa phân loại"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tag
            </label>
            <p className="mt-1 p-2 border border-gray-200 rounded bg-gray-50">
              {currentPost.tags.map((tag) => tag.name || tag).join(", ") ||
                "Không có tag"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <p className="mt-1 p-2 border border-gray-200 rounded bg-gray-50">
              {currentPost.description || "Không có mô tả"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nội dung
            </label>
            <div
              className="mt-1 p-2 border border-gray-200 rounded bg-gray-50 max-h-[30vh] overflow-y-auto prose"
              dangerouslySetInnerHTML={{ __html: currentPost.content }}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
            onClick={() => setShowDetailPostModal(false)}
            aria-label="Đóng cửa sổ chi tiết bài viết"
          >
            Đóng
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            onClick={() => openEditPostModal(currentPost)}
            aria-label="Chỉnh sửa bài viết"
          >
            Sửa
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            onClick={() => handleDeletePost(currentPost.slug)}
            aria-label="Xóa bài viết"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailPostModal;
