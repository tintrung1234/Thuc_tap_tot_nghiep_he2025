import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { publicApi, privateApi } from "../api/axios";
import BlogDetailSkeleton from "../components/BlogDetailSkeleton";
import { toast } from "react-toastify";
import {
  FaHeart,
  FaLaugh,
  FaThumbsUp,
  FaSadCry,
  FaAngry,
  FaSurprise,
  FaComment,
} from "react-icons/fa";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reactions, setReactions] = useState({ total: 0, breakdown: {} });
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [userReacted, setUserReacted] = useState({
    hasReacted: false,
    type: null,
  });
  const [showReactionDropdown, setShowReactionDropdown] = useState(false);

  const reactionIcons = {
    like: { icon: <FaThumbsUp className="text-blue-500" />, label: "Like" },
    haha: { icon: <FaLaugh className="text-yellow-500" />, label: "Haha" },
    love: { icon: <FaHeart className="text-red-500" />, label: "Love" },
    wow: { icon: <FaSurprise className="text-green-500" />, label: "Wow" },
    sad: { icon: <FaSadCry className="text-blue-700" />, label: "Sad" },
    angry: { icon: <FaAngry className="text-orange-500" />, label: "Angry" },
  };

  useEffect(() => {
    const fetchPostBySlug = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await publicApi.get(`/posts/${slug}`);
        setPost(response.data);

        const postId = response.data._id;

        // Fetch reactions count with breakdown
        const reactionRes = await publicApi.get(`/reactions/post/${postId}`);
        setReactions(reactionRes.data);

        // Fetch comments
        const commentRes = await publicApi.get(`/comments/post/${postId}`);
        setComments(commentRes.data.comments);
        setCommentCount(commentRes.data.total);

        const categorySlug = response.data.category?.slug;
        // Fetch related posts
        if (categorySlug) {
          const related = await publicApi.get(
            `/posts/category/${categorySlug}`
          );
          setRelatedPosts(related.data.posts.filter((p) => p.slug !== slug));
        }

        // Check if user has reacted
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if (token && user?.id) {
          const userReactionRes = await privateApi.get(
            `/reactions/user/${postId}`
          );
          setUserReacted(userReactionRes.data);
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

  const handleReact = async (type) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thực hiện hành động này!");
      return;
    }

    if (userReacted.hasReacted && userReacted.type === type) {
      toast.info(`Bạn đã chọn ${reactionIcons[type].label}!`);
      return;
    }

    try {
      await privateApi.post(`/reactions`, { postId: post._id, type });
      setReactions((prev) => ({
        total: prev.total + (userReacted.hasReacted ? 0 : 1),
        breakdown: {
          ...prev.breakdown,
          [type]: (prev.breakdown[type] || 0) + 1,
          ...(userReacted.hasReacted && userReacted.type !== type
            ? {
              [userReacted.type]: (prev.breakdown[userReacted.type] || 1) - 1,
            }
            : {}),
        },
      }));
      setUserReacted({ hasReacted: true, type });
      setShowReactionDropdown(false);
      toast.success(`Đã react ${reactionIcons[type].label}!`);
    } catch (error) {
      toast.error("Lỗi khi react bài viết!");
      console.error("Error reacting to post:", error);
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
      const response = await privateApi.post(`/comments`, {
        postId: post._id,
        content: newComment,
      });
      setComments((prev) => [response.data, ...prev]);
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
          className="mt-3 inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold shadow-sm hover:scale-105 transition"
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
              className="text-blue-500 text-sm font-medium hover:underline bg-blue-50 px-2 py-1 rounded"
              onClick={(e) => e.stopPropagation()}
            >
              #{tagItem.name}
            </Link>
          ))}
        </div>
      )}

      {/* Ảnh minh họa */}
      <div className="my-6 relative group overflow-hidden cursor-pointer rounded-lg" data-aos="zoom-in">
        <img
          src={post.imageUrl}
          alt="Blog Illustration"
          className="w-full h-[60vh] object-cover shadow-md transform transition-transform duration-500 group-hover:scale-105"
        />
        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition duration-500"></div> */}
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

      {/* Reactions and Comments Counts */}
      <div
        className="mt-6 flex items-center gap-6 text-gray-600"
        data-aos="fade-up"
      >
        <div
          className="relative"
          onMouseEnter={() => setShowReactionDropdown(true)}
          onMouseLeave={() => setShowReactionDropdown(false)}
        >
          <button className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition">
            {userReacted.hasReacted ? (
              reactionIcons[userReacted.type].icon
            ) : (
              <FaHeart className="text-gray-500" />
            )}
            <span>{reactions.total} React</span>
          </button>

          {showReactionDropdown && (
            <div className="absolute bottom-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-2 flex gap-2 z-10">
              {Object.entries(reactionIcons).map(([type, { icon, label }]) => (
                <button
                  key={type}
                  onClick={() => handleReact(type)}
                  className={`p-2 rounded-full hover:bg-gray-100 transition ${userReacted.type === type ? "bg-gray-100" : ""
                    }`}
                  title={label}
                >
                  {icon}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="flex items-center gap-1">
          <FaComment className="text-gray-500" /> {commentCount} Bình luận
        </span>
      </div>

      {/* Reaction Breakdown */}
      {reactions.total > 0 && (
        <div
          className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600"
          data-aos="fade-up"
        >
          {Object.entries(reactions.breakdown).map(
            ([type, count]) =>
              count > 0 && (
                <span key={type} className="flex items-center gap-1">
                  {reactionIcons[type].icon} {count}
                </span>
              )
          )}
        </div>
      )}

      {/* Comment Section */}
      <div className="mt-8" data-aos="fade-up">
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
