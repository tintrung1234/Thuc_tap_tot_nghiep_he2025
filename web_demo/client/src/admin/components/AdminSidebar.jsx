import React from "react";

const AdminSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed md:static inset-y-0 left-0 w-auto bg-gray-800 text-white transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 z-50 h-full overflow-y-auto`}
    >
      <div className="p-4 h-full">
        <a href="/admin">
          <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        </a>
        <ul className="space-y-2">
          <li>
            <a
              href="/admin/posts"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Bài viết
            </a>
          </li>
          <li>
            <a
              href="/admin/users"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Người dùng
            </a>
          </li>
        </ul>
        <button
          onClick={toggleSidebar}
          className="md:hidden absolute top-4 right-4 text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
