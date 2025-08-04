import React, { useState } from "react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase"; // 🔁 thay bằng path đúng
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!currentPassword) newErrors.current = "Vui lòng nhập mật khẩu hiện tại";
    if (!newPassword) newErrors.new = "Vui lòng nhập mật khẩu mới";
    else if (newPassword.length < 6)
      newErrors.new = "Mật khẩu mới phải có ít nhất 6 ký tự";
    if (confirmPassword !== newPassword)
      newErrors.confirm = "Mật khẩu xác nhận không khớp";
    return newErrors;
  };

  const handleChangePassword = async () => {
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const user = auth.currentUser;
    if (!user) return toast.error("Bạn chưa đăng nhập");

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);
      toast.success("Mật khẩu đã được cập nhật!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      toast.error("Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu hiện tại.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Mật khẩu hiện tại
        </label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={`mt-1 block w-full p-2 border rounded-md ${
              errors.current ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập mật khẩu hiện tại"
          />
          <button
            type="button"
            className="absolute top-2.5 right-3 text-gray-500"
            onClick={() => setShowCurrent(!showCurrent)}
          >
            {showCurrent ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.current && (
          <p className="text-red-500 text-sm mt-1">{errors.current}</p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Mật khẩu mới
        </label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`mt-1 block w-full p-2 border rounded-md ${
              errors.new ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ít nhất 6 ký tự"
          />
          <button
            type="button"
            className="absolute top-2.5 right-3 text-gray-500"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.new && (
          <p className="text-red-500 text-sm mt-1">{errors.new}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Xác nhận mật khẩu mới
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`mt-1 block w-full p-2 border rounded-md ${
              errors.confirm ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập lại mật khẩu"
          />
          <button
            type="button"
            className="absolute top-2.5 right-3 text-gray-500"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirm && (
          <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
        )}
      </div>

      {/* Submit */}
      <div className="text-right">
        <button
          onClick={handleChangePassword}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Cập nhật mật khẩu
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
