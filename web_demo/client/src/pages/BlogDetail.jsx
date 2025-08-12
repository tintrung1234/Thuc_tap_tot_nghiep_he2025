import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import BlogDetailSkeleton from "../components/BlogDetailSkeleton";
import { toast } from "react-toastify";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
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

        const categorySlug = response.data.category?.slug;
        // Lấy bài viết liên quan theo category
        if (categorySlug) {
          const related = await axios.get(
            `http://localhost:5000/api/posts/category/${categorySlug}`
          );
          setRelatedPosts(related.data.posts.filter((p) => p.slug !== slug));
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Không thể tải bài viết. Vui lòng thử lại sau!");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPostBySlug();
  }, [slug]);

  if (loading) return <BlogDetailSkeleton />;
  if (error || !post)
    return (
      <div className="max-w-4xl mx-auto my-10 px-6 py-10 bg-purple border border-black shadow-md text-center">
        <p className="text-gray-800 text-lg">Dữ liệu đang cập nhật...</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto my-10 px-6 py-10 bg-purple border border-black shadow-md rounded-xl">
      {/* Tác giả */}
      <div className="flex items-center space-x-3" data-aos="fade-right">
        <img
          src={
            post.uid.photoUrl ||
            "https://res.cloudinary.com/daeorkmlh/image/upload/v1750775424/avatar-trang-4_jjrbuu.jpg"
          }
          alt="Author Avatar"
          className="w-12 h-12 rounded-full object-cover border-2 shadow-sm"
        />
        <div>
          <p className="text-purple-700 font-semibold text-sm">
            {post.uid.username || "Tác giả không xác định"}
          </p>
          <p className="text-gray-500 text-xs">
            Đăng ngày {new Date(post.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>

      {/* Tiêu đề bài viết */}
      <h1
        className="text-3xl md:text-4xl font-extrabold leading-tight mt-4 text-gray-900"
        data-aos="fade-up"
      >
        {post.title}
      </h1>

      {/* Category */}
      {post.category && (
        <div
          className="mt-3 inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:scale-105 transition"
          data-aos="fade-left"
        >
          🎯 {post.category.name}
        </div>
      )}

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div
          className="mt-3 flex flex-wrap gap-2"
          data-aos="fade-left"
          data-aos-delay="100"
        >
          {post.tags.map((tagItem) => (
            <Link
              key={tagItem._id}
              to={`/tags/${tagItem.slug}`}
              className="bg-blue-50 text-blue-500 px-2 py-1 rounded-lg text-xs hover:bg-blue-100 transition"
              onClick={(e) => e.stopPropagation()}
            >
              #{tagItem.name}
            </Link>
          ))}
        </div>
      )}

      {/* Ảnh minh họa */}
      <div className="my-6 relative group" data-aos="zoom-in">
        <img
          src={post.imageUrl}
          alt="Blog Illustration"
          className="w-full h-[60vh] rounded-lg object-cover shadow-md group-hover:brightness-90 transition"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition"></div>
      </div>

      {/* Tóm tắt */}
      <div
        className="mb-6 p-5 bg-yellow-50 border-l-4 border-yellow-400 rounded"
        data-aos="fade-up"
      >
        <h3 className="text-lg font-semibold text-yellow-700 mb-2">
          📝 Tóm tắt bài viết
        </h3>
        <div
          className="text-gray-800 leading-relaxed text-[15px] space-y-3"
          dangerouslySetInnerHTML={{ __html: post.description }}
        />
      </div>

      {/* Nội dung */}
      <div data-aos="fade-up" data-aos-delay="100">
        <h3 className="text-lg font-semibold text-purple-700 mb-3">
          📖 Nội dung chi tiết
        </h3>
        <div
          className="prose prose-lg max-w-none text-gray-800 leading-loose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Bài viết liên quan */}
      {relatedPosts.length > 0 && (
        <div className="mt-10" data-aos="fade-up">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            🔗 Bài viết liên quan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {relatedPosts.map((item) => (
              <Link
                key={item._id}
                to={`/detail/${item.slug}`}
                className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-100"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h4 className="font-semibold text-gray-900 line-clamp-2">
                  {item.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
