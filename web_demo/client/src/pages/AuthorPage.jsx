import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AuthorSkeleton from "../components/AuthorSkeleton";
import AvatarDropzone from "../components/AvatarDropzone";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import RequireAuth from "../middleware/RequireAuth";

export default function AuthorPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    username: "",
    email: "",
    photoUrl: "",
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

  const handleDetailClick = (_id) => {
    navigate(`/detail/${encodeURIComponent(_id)}`);
  };

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
            `http://localhost:3000/api/users/profile/${userData.uid}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUser(userData);
          setProfile(profileResponse.data);
          setEditedProfile({
            username: profileResponse.data.username || "",
            email: profileResponse.data.email || "",
            photoUrl: profileResponse.data.photoUrl || "",
          });
          setPreview(profileResponse.data.photoUrl || "");
          await fetchUserPosts(userData.uid, token);
        } catch (error) {
          toast.error("Không thể tải thông tin tài khoản!");
          console.error("Error fetching profile:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } else {
        setUser(null);
        setProfile(null);
        setPosts([]);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const fetchUserPosts = async (uid, token) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/posts/user/${uid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(response.data);
    } catch (error) {
      toast.error("Không thể tải bài viết của bạn!");
      console.error("Error fetching user posts:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  const handleEditUsername = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!token || !userData?.uid)
        throw new Error("Người dùng chưa đăng nhập");

      const formData = new FormData();
      formData.append("username", editedProfile.username);
      if (avatarFile) {
        formData.append("file", avatarFile);
      }
      if (removeAvatar) {
        formData.append("removeAvatar", "true");
      }

      const response = await axios.put(
        `http://localhost:3000/api/users/profile/${userData.uid}`,
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
        setEditedProfile(response.data.user);
        setAvatarError("");
        setRemoveAvatar(false);
        setIsEditModalOpen(false);
        toast.success("Cập nhật thông tin thành công!");
        // Cập nhật user trong localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
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
        `http://localhost:3000/api/users/change-password`,
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

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditedProfile({
      username: profile?.username || "",
      email: profile?.email || "",
      photoUrl: profile?.photoUrl || "",
    });
    setAvatarFile(null);
    setAvatarError("");
    setShowChangePassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors({});
  };

  const truncateDescription = (html, maxLength) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    if (text.length <= maxLength) return html;
    return (
      `${text.substring(0, maxLength)}...` +
      div.innerHTML.substring(0, div.innerHTML.indexOf(">", maxLength))
    );
  };

  if (loading) {
    return <AuthorSkeleton />;
  }

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans text-center p-6">
        <RequireAuth />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-purple py-12 px-6 md:px-20 flex flex-col justify-center md:flex-row items-center gap-10">
        <img
          src={
            profile?.photoUrl ||
            "https://res.cloudinary.com/daeorkmlh/image/upload/v1750775424/avatar-trang-4_jjrbuu.jpg"
          }
          alt="Profile"
          className="w-36 h-36 md:w-48 md:h-48 object-cover rounded-full"
        />
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
            Hey there, I’m {profile?.username || "Anonymous"} <br /> and welcome
            to my Blog
          </h1>
          <p className="text-gray-600 mt-4 max-w-xl">
            {profile?.email || "No email provided"} - Lorem ipsum dolor sit
            amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Non blandit massa enim nec.
          </p>
          <div className="flex gap-4 mt-4 text-gray-600">
            <a href="#" className="text-gray-400 hover:text-blue-400">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400">
              <FaYoutube />
            </a>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Đăng xuất
            </button>
            <button
              onClick={handleEditUsername}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="top-0 left-0 w-full h-[15px] flex justify-center overflow-hidden -translate-y-4">
        <div className="bg-yellow-400 w-2/5 h-full"></div>
        <div className="bg-purple-600 w-60 h-full"></div>
      </div>

      {/* Posts Section */}
      <div className="w-full flex justify-center">
        <section className="px-6 py-12 w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">My Posts</h2>
          <div
            className="space-y-10 mb-8 shadow rounded cursor-pointer w-full"
            data-aos="fade-up"
          >
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="flex flex-col md:flex-row gap-6 items-center w-full p-4 bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => handleDetailClick(post._id)}
                >
                  <img
                    src={post.imageUrl || "/placeholder-image.jpg"}
                    alt={post.title}
                    className="w-full md:w-1/3 h-48 object-cover rounded-lg"
                  />
                  <div className="flex-1 p-4">
                    <p className="text-purple-600 uppercase font-semibold text-sm">
                      {post.category?.name || post.category || "Uncategorized"}
                    </p>
                    <h3 className="text-xl font-bold text-gray-800 mt-1 line-clamp-2">
                      {post.title || "Untitled Post"}
                    </h3>
                    <div className="text-gray-600 mt-2">
                      <h2
                        className="mr-1 max-h-[50vh] overflow-y-auto overflow-x-hidden"
                        style={{ maxHeight: "50vh" }}
                        dangerouslySetInnerHTML={{
                          __html:
                            truncateDescription(post.description || "", 200) ||
                            "",
                        }}
                      ></h2>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {post.tags.map((tagItem, tagIndex) => (
                          <a
                            key={tagIndex}
                            href={`/tags/${tagItem.name || tagItem}`}
                            className="text-blue-500 text-sm hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            #{tagItem.name || tagItem}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <a
                    href={`/edit-post/${post._id}`}
                    className="text-blue-700 hover:underline ml-auto p-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-600 p-4">No posts available.</p>
            )}
          </div>
        </section>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={editedProfile.email}
                  disabled
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Avatar
                </label>
                <AvatarDropzone
                  setAvatarFile={setAvatarFile}
                  setPreview={setPreview}
                  setAvatarError={setAvatarError}
                />

                {preview && (
                  <div className="mt-2 flex items-center gap-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-full"
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
                  <p className="text-red-500 text-sm mt-1">{avatarError}</p>
                )}
              </div>

              {/* Toggle Password */}
              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={showChangePassword}
                    onChange={() => setShowChangePassword((prev) => !prev)}
                    className="mr-2"
                  />
                  Thay đổi mật khẩu
                </label>
              </div>

              {/* Change Password Form */}
              {showChangePassword && (
                <div className="space-y-4 mt-2">
                  {passwordErrors.form && (
                    <p className="text-red-500 text-sm">
                      {passwordErrors.form}
                    </p>
                  )}

                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type={showPass.current ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={`mt-1 block w-full p-2 border rounded-md ${
                          passwordErrors.current
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute top-2.5 right-3 text-gray-500"
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
                    <label className="block text-sm font-medium text-gray-700">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showPass.new ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`mt-1 block w-full p-2 border rounded-md ${
                          passwordErrors.new
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute top-2.5 right-3 text-gray-500"
                        onClick={() =>
                          setShowPass((p) => ({ ...p, new: !p.new }))
                        }
                      >
                        {showPass.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {passwordErrors.new && (
                      <p className="text-red-500 text-sm">
                        {passwordErrors.new}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showPass.confirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`mt-1 block w-full p-2 border rounded-md ${
                          passwordErrors.confirm
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute top-2.5 right-3 text-gray-500"
                        onClick={() =>
                          setShowPass((p) => ({ ...p, confirm: !p.confirm }))
                        }
                      >
                        {showPass.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {passwordErrors.confirm && (
                      <p className="text-red-500 text-sm">
                        {passwordErrors.confirm}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
