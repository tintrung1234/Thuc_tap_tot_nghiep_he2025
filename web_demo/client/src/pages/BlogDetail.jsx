import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import UserAva from "../assets/UserAva.jpg";
import axios from "axios";
import BlogDetailSkeleton from "../components/BlogDetailSkeleton";
import { toast } from "react-toastify";

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userName, setUserName] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchPostById = async () => {
      setLoading(true);
      setError(false);
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const response = await axios.get(
          `http://localhost:5000/api/posts/detail/${encodeURIComponent(id)}`,
          config
        );
        setPost(response.data);
      } catch (error) {
        toast.error("Không thể tải bài viết. Vui lòng thử lại sau!");
        console.error("Error fetching post by id:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPostById();
  }, [id]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (token && user?.uid) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/users/${user.uid}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProfile(response.data);
        } catch (error) {
          toast.error("Không thể tải thông tin tài khoản!");
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const getUserName = async () => {
      if (!post || !post.uid) return;
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const response = await axios.get(
          `http://localhost:5000/api/users/${post.uid}`,
          config
        );
        setUserName(response.data.username);
      } catch (error) {
        toast.error("Không thể tải thông tin người dùng!");
        console.error("Error fetching user:", error);
      }
    };

    getUserName();
  }, [post]);

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto my-10 px-6 py-10 bg-purple border border-black shadow-md text-center">
        <p className="text-gray-800 text-lg">Dữ liệu đang cập nhật...</p>
      </div>
    );
  }

  const { category, title, description, createdAt, imageUrl, tags } = post;

  return (
    <div
      className="max-w-4xl mx-auto my-10 px-6 py-10 bg-purple border border-black shadow-md"
      data-aos="fade-up"
      data-aos-duration="1000"
      data-aos-easing="ease-in-out"
    >
      {/* Tác giả */}
      <div className="flex items-center space-x-3">
        <img
          src={
            profile?.photoUrl ||
            "https://res.cloudinary.com/daeorkmlh/image/upload/v1750775424/avatar-trang-4_jjrbuu.jpg"
          }
          alt="Author Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-blue-600 font-semibold text-sm">
            {userName || "Tác giả không xác định"}
          </p>
          <p className="text-gray-500 text-xs">
            Đăng ngày {new Date(createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>

      {/* Tiêu đề bài viết */}
      <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mt-4 text-gray-900">
        {title}
      </h1>

      {/* Category */}
      <div className="mt-3 text-gray-700 font-medium flex items-center space-x-1">
        <span role="img" aria-label="emoji">
          🎯
        </span>
        <span>{category?.name || category}</span>
      </div>

      {/* Tags */}
      <div className="text-gray-700 font-medium flex items-center space-x-1">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tagItem, tagIndex) => (
              <Link
                key={tagIndex}
                to={`/tags/${tagItem}`}
                className="text-blue-500 text-sm hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                #{tagItem.name || tagItem}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Ảnh minh họa */}
      <div className="my-5">
        <img
          src={imageUrl}
          alt="Blog Illustration"
          className="w-full rounded-md object-cover"
        />
      </div>

      {/* Nội dung HTML từ Editor */}
      <div
        className="text-gray-800 leading-relaxed text-[15px] space-y-4"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}
