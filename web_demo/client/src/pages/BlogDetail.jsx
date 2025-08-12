import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import BlogDetailSkeleton from "../components/BlogDetailSkeleton";
import { toast } from "react-toastify";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPostBySlug = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/${slug}`
        );
        setPost(response.data);
      } catch (error) {
        toast.error("Không thể tải bài viết. Vui lòng thử lại sau!");
        console.error("Error fetching post by slug:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPostBySlug();
  }, [slug]);

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
            post.uid.photoUrl ||
            "https://res.cloudinary.com/daeorkmlh/image/upload/v1750775424/avatar-trang-4_jjrbuu.jpg"
          }
          alt="Author Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-blue-600 font-semibold text-sm">
            {post.uid.username || "Tác giả không xác định"}
          </p>
          <p className="text-gray-500 text-xs">
            Đăng ngày {new Date(post.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>

      {/* Tiêu đề bài viết */}
      <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mt-4 text-gray-900">
        {post.title}
      </h1>

      {/* Category */}
      <div className="mt-3 text-gray-700 font-medium flex items-center space-x-1">
        <span role="img" aria-label="emoji">
          🎯
        </span>
        <span>{post.category?.name}</span>
      </div>

      {/* Tags */}
      <div className="text-gray-700 font-medium flex items-center space-x-1">
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags.map((tagItem) => (
              <Link
                key={tagItem._id}
                to={`/tags/${tagItem.slug}`}
                className="text-blue-500 text-sm hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                #{tagItem.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Ảnh minh họa */}
      <div className="my-5">
        <img
          src={post.imageUrl}
          alt="Blog Illustration"
          className="w-full h-[60vh] rounded-md object-cover"
        />
      </div>

      {/* Nội dung description */}
      <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h3 className="text-lg font-semibold text-yellow-700 mb-2">
          📝 Tóm tắt bài viết
        </h3>
        <div
          className="text-gray-800 leading-relaxed text-[15px] space-y-3"
          dangerouslySetInnerHTML={{ __html: post.description }}
        />
      </div>

      {/* Nội dung content */}
      <div>
        <h3 className="text-lg font-semibold text-purple-700 mb-3">
          📖 Nội dung chi tiết
        </h3>
        <div
          className="text-gray-800 leading-loose text-[16px] space-y-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
