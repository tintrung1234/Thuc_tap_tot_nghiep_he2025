import React from "react";
import { useNavigate } from "react-router-dom";

function Header({ toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Xóa token trong localStorage hoặc sessionStorage
      localStorage.removeItem("token");

      // Nếu backend có endpoint logout thì có thể gọi ở đây:
      // fetch("http://localhost:5000/api/auth/logout", {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // });

      navigate("/login");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button className="md:hidden p-2" onClick={toggleSidebar}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold ml-2">VFriends Admin</h1>
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Đăng xuất
      </button>
    </header>
  );
}

export default Header;
