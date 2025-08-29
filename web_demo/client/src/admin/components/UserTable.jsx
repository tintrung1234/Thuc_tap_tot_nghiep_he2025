import React from "react";

function UserTable({
  users,
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  uniqueRoles,
  sortKey,
  sortOrder,
  handleSort,
  openEditUserModal,
  handleDeleteUser,
  setShowCreateUserModal,
  getPostCount,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-purple-700">
          Quản lý người dùng
        </h2>
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          onClick={() => setShowCreateUserModal(true)}
          aria-label="Tạo người dùng mới"
        >
          Tạo người dùng
        </button>
      </div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Tìm kiếm tên hoặc email..."
          className="p-2 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Tìm kiếm người dùng"
        />
        <select
          className="p-2 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          aria-label="Chọn vai trò để lọc người dùng"
        >
          <option value="">Tất cả vai trò</option>
          {uniqueRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
          <input
            type="date"
            className="p-2 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label="Chọn ngày bắt đầu"
          />
          <input
            type="date"
            className="p-2 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-label="Chọn ngày kết thúc"
          />
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Không có người dùng nào.
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("username")}
                >
                  Tên{" "}
                  {sortKey === "username" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                  Ảnh đại diện
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                  Tiểu sử
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("postCount")}
                >
                  Số bài viết{" "}
                  {sortKey === "postCount" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.uid}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {user.registered}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {user.photoUrl ? (
                      <a
                        href={user.photoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Xem ảnh
                      </a>
                    ) : (
                      "Không có"
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {user.bio || "Không có"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {getPostCount(user.uid)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-purple-600 hover:underline mr-2"
                      onClick={() => openEditUserModal(user)}
                      aria-label={`Chỉnh sửa người dùng ${user.username}`}
                    >
                      Sửa
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteUser(user.uid)}
                      aria-label={`Xóa người dùng ${user.username}`}
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

export default UserTable;
