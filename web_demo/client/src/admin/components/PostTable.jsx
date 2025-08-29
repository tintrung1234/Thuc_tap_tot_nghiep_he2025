import React from "react";

function PostTable({
  posts,
  postSearchTerm,
  setPostSearchTerm,
  selectedTag,
  setSelectedTag,
  uniqueTags,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedCategory,
  setSelectedCategory,
  uniqueCategories,
  openDetailPostModal,
  openEditPostModal,
  handleDeletePost,
}) {
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-purple-700">
          Quản lý bài viết
        </h2>
      </div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Tìm kiếm bài viết hoặc tag..."
          className="p-2 border border-gray-200 rounded-md w-full md:max-w-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={postSearchTerm}
          onChange={(e) => setPostSearchTerm(e.target.value)}
          aria-label="Tìm kiếm bài viết hoặc tag"
        />
        <select
          className="p-2 border border-gray-200 rounded-md w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          aria-label="Chọn tag để lọc bài viết"
        >
          <option value="">Tất cả tag</option>
          {uniqueTags.map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          ))}
        </select>
        <select
          className="p-2 border border-gray-200 rounded-md w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Chọn danh mục để lọc bài viết"
        >
          <option value="">Tất cả danh mục</option>
          {uniqueCategories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="flex space-x-2">
          <input
            type="date"
            className="p-2 border border-gray-200 rounded-md w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label="Chọn ngày bắt đầu"
          />
          <input
            type="date"
            className="p-2 border border-gray-200 rounded-md w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-label="Chọn ngày kết thúc"
          />
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Không có bài viết nào.
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                  Ngày đăng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                  Tag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {post.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {post.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {post.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {post.category?.name || "Chưa phân loại"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {post.tags.map((tag) => tag.name || tag).join(", ") ||
                      "Không có tag"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-purple-600 hover:underline mr-2"
                      onClick={() => openDetailPostModal(post)}
                      aria-label={`Xem chi tiết bài viết ${post.title}`}
                    >
                      Chi tiết
                    </button>
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => openEditPostModal(post)}
                      aria-label={`Chỉnh sửa bài viết ${post.title}`}
                    >
                      Sửa
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeletePost(post.slug)}
                      aria-label={`Xóa bài viết ${post.title}`}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PostTable;
