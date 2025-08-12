import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!token || !user) {
      toast.error("Vui lòng đăng nhập để truy cập trang này!");
    }
  }, [token, user]);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children || null;
}
