import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function RequireAuthAdmin({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("Bạn chưa đăng nhập!", {
          autoClose: 700,
        });
        navigate("/login");
      } else {
        try {
          // Lấy role từ backend bằng uid
          const res = await axios.get(`http://localhost:5000/api/users/profile/${user.uid}`);
          console.log("User role:", res.data?.role);
          if (res.data?.role === "Admin") {
            toast.success("Đã đăng nhập với quyền Admin!", {
              autoClose: 500,
            });
          } else {
            navigate("/not-found-page"); // Trang thông báo không có quyền
          }
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          navigate("/not-found-page");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return children;
}
