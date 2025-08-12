import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RequireAuthAdmin({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    toast.error("Vui lòng đăng nhập để truy cập!");
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    toast.error("Bạn cần quyền admin để truy cập trang này!");
    return <Navigate to="/" replace />;
  }

  return children || null;
}
