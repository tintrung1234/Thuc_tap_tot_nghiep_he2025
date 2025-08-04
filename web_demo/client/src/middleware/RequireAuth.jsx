import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [loadingToast, setLoadingToast] = useState(null);

  useEffect(() => {
    // Show loading toast
    const toastId = toast.loading("Đang kiểm tra đăng nhập...");
    setLoadingToast(toastId);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast.update(toastId, {
          render: "Bạn chưa đăng nhập!",
          type: "error",
          isLoading: false,
          autoClose: 700,
        });
        navigate("/login");
      } else {
        toast.update(toastId, {
          render: "Đã đăng nhập!",
          type: "success",
          isLoading: false,
          autoClose: 500,
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return children;
}
