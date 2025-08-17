import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AvatarDropzone from "../components/AvatarDropzone";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import RequireAuth from "../middleware/RequireAuth";

export default function EditProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedProfile, setEditedProfile] = useState({
    username: "",
    email: "",
    photoUrl: "",
    bio: "",
    social: { facebook: "", twitter: "", instagram: "", linkedin: "" },
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarError, setAvatarError] = useState("");
  const [preview, setPreview] = useState("");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const navigate = useNavigate();

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setPreview("");
    setRemoveAvatar(true);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));
      if (token && userData?.uid) {
        try {
          const profileResponse = await axios.get(
            `http://localhost:5000/api/users/${userData.uid}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProfile(profileResponse.data);
          setEditedProfile({
            username: profileResponse.data.username || "",
            email: profileResponse.data.email || "",
            photoUrl: profileResponse.data.photoUrl || "",
            bio: profileResponse.data.bio || "",
            social: {
              facebook: profileResponse.data.social?.facebook || "",
              twitter: profileResponse.data.social?.twitter || "",
              instagram: profileResponse.data.social?.instagram || "",
              linkedin: profileResponse.data.social?.linkedin || "",
            },
          });
          setPreview(profileResponse.data.photoUrl || "");
        } catch (error) {
          toast.error("Không thể tải thông tin tài khoản!");
          console.error("Error fetching profile:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!token || !userData?.uid)
        throw new Error("Người dùng chưa đăng nhập");

      const formData = new FormData();
      formData.append("username", editedProfile.username);
      formData.append("bio", editedProfile.bio);
      formData.append("social", JSON.stringify(editedProfile.social));
      if (avatarFile) {
        formData.append("photo", avatarFile);
      }
      if (removeAvatar) {
        formData.append("removeAvatar", "true");
      }

      const response = await axios.put(
        `http://localhost:5000/api/users/${userData.uid}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      let passwordSuccess = true;
      if (showChangePassword) {
        const passwordResult = await handlePasswordUpdate();
        passwordSuccess = passwordResult.success;
        if (!passwordResult.success) {
          setPasswordErrors(passwordResult.error);
          throw new Error(passwordResult.error.form || "Mật khẩu không hợp lệ");
        }
      }

      if (passwordSuccess) {
        setProfile(response.data.user);
        setEditedProfile({
          username: response.data.user.username,
          email: response.data.user.email,
          photoUrl: response.data.user.photoUrl,
          bio: response.data.user.bio,
          social: response.data.user.social,
        });
        setAvatarError("");
        setRemoveAvatar(false);
        toast.success("Cập nhật thông tin thành công!");
        localStorage.setItem("user", JSON.stringify(response.data.user));

        navigate("/author");
      }
    } catch (error) {
      toast.error("Cập nhật thông tin thất bại! Kiểm tra lại thông tin.");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setPasswordErrors({});

    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!token || !userData?.uid) {
      return { success: false, error: { form: "Người dùng chưa đăng nhập" } };
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return {
        success: false,
        error: { form: "Vui lòng nhập đầy đủ các trường" },
      };
    }

    if (newPassword.length < 6) {
      return { success: false, error: { new: "Mật khẩu mới ít nhất 6 ký tự" } };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        error: { confirm: "Mật khẩu xác nhận không khớp" },
      };
    }

    try {
      await axios.post(
        `http://localhost:5000/api/users/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);
      return { success: true };
    } catch (error) {
      console.error("Đổi mật khẩu lỗi:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Đổi mật khẩu thất bại. Kiểm tra lại thông tin.";
      return { success: false, error: { form: errorMessage } };
    }
  };

  const handleCancel = () => {
    navigate("/author");
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans flex justify-center items-center p-6">
        <div className="text-gray-600 text-lg">Đang tải...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans flex justify-center items-center p-6">
        <RequireAuth />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
          Chỉnh sửa thông tin
        </h2>

        {/* Profile Info Section */}
        <section className="mb-12 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">
            Thông tin cơ bản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={editedProfile.username}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    username: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                placeholder="Nhập username"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={editedProfile.email}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={editedProfile.bio}
              onChange={(e) =>
                setEditedProfile({
                  ...editedProfile,
                  bio: e.target.value,
                })
              }
              maxLength={160}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              rows="4"
              placeholder="Giới thiệu ngắn về bạn (tối đa 160 ký tự)"
            />
            <p className="text-sm text-gray-500 mt-1">
              {editedProfile.bio.length}/160 ký tự
            </p>
          </div>
        </section>

        {/* Avatar Section */}
        <section className="mb-12 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">
            Ảnh đại diện
          </h3>
          <AvatarDropzone
            setAvatarFile={setAvatarFile}
            setPreview={setPreview}
            setAvatarError={setAvatarError}
          />
          {preview && (
            <div className="mt-4 flex items-center gap-4">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-full border border-gray-200"
              />
              <button
                onClick={handleRemoveAvatar}
                className="text-red-500 text-sm hover:underline"
              >
                Xoá ảnh
              </button>
            </div>
          )}
          {avatarError && (
            <p className="text-red-500 text-sm mt-2">{avatarError}</p>
          )}
        </section>

        {/* Social Links Section */}
        <section className="mb-12 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">
            Liên kết mạng xã hội
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="text"
                placeholder="Facebook URL"
                value={editedProfile.social.facebook}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    social: {
                      ...editedProfile.social,
                      facebook: e.target.value,
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <input
                type="text"
                placeholder="Twitter URL"
                value={editedProfile.social.twitter}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    social: {
                      ...editedProfile.social,
                      twitter: e.target.value,
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="text"
                placeholder="Instagram URL"
                value={editedProfile.social.instagram}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    social: {
                      ...editedProfile.social,
                      instagram: e.target.value,
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="text"
                placeholder="LinkedIn URL"
                value={editedProfile.social.linkedin}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    social: {
                      ...editedProfile.social,
                      linkedin: e.target.value,
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
          </div>
        </section>

        {/* Password Section */}
        <section className="mb-12 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">
            Thay đổi mật khẩu
          </h3>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={showChangePassword}
                onChange={() => setShowChangePassword((prev) => !prev)}
                className="mr-2 h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Thay đổi mật khẩu
              </span>
            </label>
          </div>

          {showChangePassword && (
            <div className="space-y-4">
              {passwordErrors.form && (
                <p className="text-red-500 text-sm">{passwordErrors.form}</p>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showPass.current ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`w-full p-3 border rounded-lg ${
                      passwordErrors.current
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition`}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                    onClick={() =>
                      setShowPass((p) => ({ ...p, current: !p.current }))
                    }
                  >
                    {showPass.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPass.new ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full p-3 border rounded-lg ${
                      passwordErrors.new ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition`}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPass((p) => ({ ...p, new: !p.new }))}
                  >
                    {showPass.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {passwordErrors.new && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.new}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPass.confirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full p-3 border rounded-lg ${
                      passwordErrors.confirm
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition`}
                    placeholder="Xác nhận mật khẩu mới"
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                    onClick={() =>
                      setShowPass((p) => ({ ...p, confirm: !p.confirm }))
                    }
                  >
                    {showPass.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {passwordErrors.confirm && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.confirm}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveProfile}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
