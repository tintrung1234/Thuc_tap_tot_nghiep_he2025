import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PostItem = ({ post }) => {
  const navigate = useNavigate();

  const handleDetailClick = (slug) => {
    navigate(`/detail/${slug}`);
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
      <div className="p-6 w-2/3">
        <span className="text-purple-600 tracking-widest font-semibold text-sm text-transform: uppercase">
          {post.category.name}
        </span>
        <h2 className="text-2xl font-semibold text-gray-800 mt-2 mb-2">
          {post.title}
        </h2>
        <div className="text-gray-600" />
        <h2
          className="mr-1 w-full overflow-y-auto mt-2 mb-4"
          dangerouslySetInnerHTML={{
            __html: post?.description || "",
          }}
        ></h2>
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
    </div>
  );
};

export default PostItem;
