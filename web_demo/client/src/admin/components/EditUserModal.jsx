import React, { useEffect } from "react";

function EditUserModal({
  showEditUserModal,
  setShowEditUserModal,
  currentUser,
  handleEditUser,
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowEditUserModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setShowEditUserModal]);

  if (!showEditUserModal || !currentUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-purple-700 mb-4">
          Chỉnh sửa người dùng
        </h2>
        <form onSubmit={handleEditUser}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên
              </label>
              <input
                type="text"
                name="username"
                defaultValue={currentUser.username}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                minLength={3}
                maxLength={30}
                aria-label="Tên người dùng"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                readOnly
                name="email"
                defaultValue={currentUser.email}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                aria-label="Email người dùng"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh đại diện URL
              </label>
              <input
                type="text"
                name="photoUrl"
                defaultValue={currentUser.photoUrl}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="URL ảnh đại diện"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiểu sử
              </label>
              <textarea
                name="bio"
                defaultValue={currentUser.bio}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={160}
                rows={3}
                aria-label="Tiểu sử người dùng"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vai trò
              </label>
              <select
                name="role"
                defaultValue={currentUser.role}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Chọn vai trò người dùng"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái hoạt động
              </label>
              <select
                name="isActive"
                defaultValue={currentUser.isActive.toString()}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Trạng thái hoạt động"
              >
                <option value="true">Hoạt động</option>
                <option value="false">Không hoạt động</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đã xóa
              </label>
              <select
                name="isDeleted"
                defaultValue={currentUser.isDeleted.toString()}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Trạng thái đã xóa"
              >
                <option value="false">Chưa xóa</option>
                <option value="true">Đã xóa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="text"
                name="social[facebook]"
                defaultValue={currentUser.social?.facebook}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Liên kết Facebook"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <input
                type="text"
                name="social[twitter]"
                defaultValue={currentUser.social?.twitter}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Liên kết Twitter"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="text"
                name="social[instagram]"
                defaultValue={currentUser.social?.instagram}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Liên kết Instagram"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="text"
                name="social[linkedin]"
                defaultValue={currentUser.social?.linkedin}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Liên kết LinkedIn"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              onClick={() => setShowEditUserModal(false)}
              aria-label="Hủy chỉnh sửa người dùng"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              aria-label="Lưu chỉnh sửa người dùng"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
