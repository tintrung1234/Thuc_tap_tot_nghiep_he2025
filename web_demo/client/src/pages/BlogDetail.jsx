import React, { useState, useEffect } from "react";
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
  const [reactions, setReactions] = useState(0);
  const [shares, setShares] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [userReacted, setUserReacted] = useState(false); // Track if user has reacted
  const [userShared, setUserShared] = useState(false); // Track if user has shared

  useEffect(() => {
    const fetchPostBySlug = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/${slug}`
        );
        setPost(response.data);

        const postId = response.data._id;

        // Fetch reactions count
        const reactionRes = await axios.get(
          `http://localhost:5000/api/reactions/post/${postId}`
        );
        setReactions(reactionRes.data.total);

        // Fetch shares count
        const shareRes = await axios.get(
          `http://localhost:5000/api/shares/post/${postId}`
        );
        setShares(shareRes.data.total);

        // Fetch comments
        const commentRes = await axios.get(
          `http://localhost:5000/api/comments/post/${postId}`
        );
        setComments(commentRes.data.comments);
        setCommentCount(commentRes.data.total);

        const categorySlug = response.data.category?.slug;
        // Fetch related posts
        if (categorySlug) {
          const related = await axios.get(
            `http://localhost:5000/api/posts/category/${categorySlug}`
          );
          setRelatedPosts(related.data.posts.filter((p) => p.slug !== slug));
        }

        // Check if user has reacted or shared (requires authentication)
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (token && user?.uid) {
          // Assume endpoints to check user interaction
          const userReactionRes = await axios.get(
            `http://localhost:5000/api/reactions/user/${user.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserReacted(userReactionRes.data.hasReacted);

          const userShareRes = await axios.get(
            `http://localhost:5000/api/shares/user/${user.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserShared(userShareRes.data.hasShared);
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

  const handleReact = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thực hiện hành động này!");
      return;
    }

    if (userReacted) {
      toast.info("Bạn đã react bài viết này!");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/reactions`,
        { postId: post._id, type: "like" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReactions((prev) => prev + 1);
      setUserReacted(true);
      toast.success("Đã react bài viết!");
    } catch (error) {
      toast.error("Lỗi khi react bài viết!");
      console.error("Error reacting to post:", error);
    }
  };

  const handleShare = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thực hiện hành động này!");
      return;
    }

    if (userShared) {
      toast.info("Bạn đã share bài viết này!");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/shares`,
        { postId: post._id, sharedTo: "profile" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShares((prev) => prev + 1);
      setUserShared(true);
      toast.success("Đã share bài viết!");
    } catch (error) {
      toast.error("Lỗi khi share bài viết!");
      console.error("Error sharing post:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để bình luận!");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/comments`,
        { postId: post._id, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [response.data.comment, ...prev]);
      setCommentCount((prev) => prev + 1);
      setNewComment("");
      toast.success("Đã thêm bình luận!");
    } catch (error) {
      toast.error("Lỗi khi thêm bình luận!");
      console.error("Error adding comment:", error);
    }
  };

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
        <h3 className="text-xl font-semibold text-purple-700 mb-3">
          📖 Nội dung chi tiết
        </h3>
        <div
          className="prose prose-lg max-w-none text-gray-800 leading-loose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Reactions, Shares, Comments Counts */}
      <div
        className="mt-6 flex items-center gap-6 text-gray-600"
        data-aos="fade-up"
      >
        <button
          onClick={handleReact}
          className={`flex items-center gap-1 ${
            userReacted ? "text-red-500" : "text-gray-600 hover:text-red-500"
          } transition`}
        >
          ❤️ {reactions} React
        </button>
        <button
          onClick={handleShare}
          className={`flex items-center gap-1 ${
            userShared ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
          } transition`}
        >
          🔗 {shares} Share
        </button>
        <span className="flex items-center gap-1">
          💬 {commentCount} Bình luận
        </span>
      </div>

      {/* Comment Section */}
      <div className="mt-10" data-aos="fade-up">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Bình luận</h3>
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Thêm bình luận của bạn..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
          />
          <button
            type="submit"
            className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Gửi bình luận
          </button>
        </form>

        {/* Comment List */}
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 bg-gray-50 rounded-md mb-4 shadow-sm"
            >
              <div className="flex items-center space-x-3 mb-2">
                <img
                  src={
                    comment.userId.photoUrl ||
                    "https://res.cloudinary.com/daeorkmlh/image/upload/v1750775424/avatar-trang-4_jjrbuu.jpg"
                  }
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-semibold text-sm">
                    {comment.userId.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </p>
        )}
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
