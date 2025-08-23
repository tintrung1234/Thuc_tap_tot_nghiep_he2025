import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShare, FaComment } from "react-icons/fa";

const PostItem = ({ post }) => {
  const navigate = useNavigate();

  const handleDetailClick = (slug) => {
    navigate(`/detail/${slug}`);
  };

  const truncateDescription = (html, maxLength = 150) => {
    // Strip HTML tags for truncation
    const text = html.replace(/<[^>]+>/g, "");
    if (text.length <= maxLength) return html;
    const truncatedText = text.slice(0, maxLength) + "...";
    return `<p>${truncatedText}</p>`;
  };

  return (
    <div
      className="mb-8 flex bg-white shadow rounded overflow-hidden cursor-pointer"
      data-aos="fade-up"
      onClick={() => {
        handleDetailClick(post.slug);
      }}
    >
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-1/3 h-60 object-cover "
      />
      <div className="p-8 w-2/3">
        <span className="text-purple-600 tracking-widest font-semibold text-sm text-transform: uppercase">
          {post.category.name}
        </span>
        <h3 className="text-xl font-bold mt-1 text-gray-800 hover:text-purple-700 transition-colors">
          {post.title || "Không có tiêu đề"}
        </h3>
        <div className="text-gray-600" />
        <div className="text-gray-600 text-sm mt-2 line-clamp-3 mb-4">
          <div
            dangerouslySetInnerHTML={{
              __html: truncateDescription(post.description || ""),
            }}
          />
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
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
        {/* Reactions, Shares, Comments */}
        <div className="mt-3 flex items-center gap-4 text-gray-500 text-sm">
          <span className="flex items-center gap-1">
            <FaHeart className="text-red-500" /> {post.reactions || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaShare className="text-blue-500" /> {post.shares || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaComment className="text-gray-500" /> {post.comments || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
