import React from "react";

function UserTable({
  // eslint-disable-next-line no-unused-vars
  users,
  // eslint-disable-next-line no-unused-vars
  posts,
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  uniqueRoles,
  sortKey,
  sortOrder,
  handleSort,
  filteredUsers,
  setSelectedUser,
  openEditUserModal,
  handleDeleteUser,
  setShowCreateUserModal,
  getPostCount,
}) {
  // Handle case where filteredUsers is undefined
  if (!filteredUsers || filteredUsers.length === 0) {
    return (
      <div className="text-center py-4">
        <p>Không có người dùng nào để hiển thị hoặc đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Quản lý người dùng</h2>
      </div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng (tên hoặc email)..."
          className="p-2 border rounded w-full md:max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded w-full md:w-40"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          {uniqueRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full md:w-auto"
          onClick={() => setShowCreateUserModal(true)}
        >
          Thêm người dùng
        </button>
      </div>
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đăng ký
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("postCount")}
              >
                Số lượng bài đăng
                <span className="inline-block ml-1">
                  {sortKey === "postCount"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.uid}>
                {" "}
                {/* Changed from user.id to user.uid */}
                <td className="px-6 py-4 whitespace-nowrap">{user.uid}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.registered}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPostCount(user.uid)}{" "}
                  {/* Changed from user.id to user.uid */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="text-green-600 hover:underline mr-2"
                    onClick={() => setSelectedUser(user)}
                  >
                    Chi tiết
                  </button>
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => openEditUserModal(user)}
                  >
                    Sửa
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteUser(user.uid)} // Changed from user.id to user.uid
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;
