import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PostItem = ({ post }) => {
  const navigate = useNavigate();

  const handleDetailClick = (_id) => {
    navigate(`/detail/${encodeURIComponent(_id)}`);
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

  return (
    <div
      className="mb-8 flex bg-white shadow rounded overflow-hidden cursor-pointer"
      data-aos="fade-up"
      onClick={() => {
        handleDetailClick(post._id);
      }}
    >
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-1/3 h-auto object-cover"
      />
      <div className="p-6 w-2/3">
        <span className="text-purple-600 tracking-widest font-semibold text-sm text-transform: uppercase">
          {post.category}
        </span>
        <h2 className="text-2xl font-semibold text-gray-800 mt-2 mb-2">
          {post.title}
        </h2>
        <div className="text-gray-600" />
        <h2
          className="mr-1 w-[50vw] max-h-[50vh] overflow-y-auto mt-2 mb-4"
          style={{ maxHeight: "50vh" }} // Fallback for older browsers
          dangerouslySetInnerHTML={{
            __html: truncateDescription(post?.description || "", 200) || "",
          }}
        ></h2>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags.map((tagItem, tagIndex) => (
              <Link
                key={tagIndex}
                to={`/tags/${tagItem}`}
                className="text-blue-500 text-sm hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                #{tagItem}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostItem;
