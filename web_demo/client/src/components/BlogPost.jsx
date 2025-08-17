import { Link, useNavigate } from "react-router-dom";

const BlogPost = ({ slug, category, title, description, tags, imageUrl }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(`/detail/${slug}`);
  };

  // Truncate description to prevent overflow (e.g., 150 characters)
  const truncateDescription = (html, maxLength = 150) => {
    // Strip HTML tags for truncation
    const text = html.replace(/<[^>]+>/g, "");
    if (text.length <= maxLength) return html;
    const truncatedText = text.slice(0, maxLength) + "...";
    return `<p>${truncatedText}</p>`;
  };

  return (
    <div
      className="flex flex-col sm:flex-row bg-white p-4 rounded-lg shadow-md mb-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
      data-aos="fade-right"
      onClick={handleDetailClick}
    >
      {/* Image */}
      <div className="sm:w-40 sm:h-40 w-full h-48 flex-shrink-0">
        <img
          src={
            imageUrl ||
            "https://res.cloudinary.com/daeorkmlh/image/upload/v1750835215/No-Image-Placeholder.svg_v0th8g.png"
          }
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="flex-1 sm:ml-4 mt-4 sm:mt-0">
        {/* Category */}
        <span className="text-purple-600 text-sm font-semibold uppercase">
          {category?.name || "Chưa phân loại"}
        </span>

        {/* Title */}
        <h3 className="text-xl font-bold mt-1 text-gray-800 hover:text-purple-700 transition-colors">
          {title || "Không có tiêu đề"}
        </h3>

        {/* Description */}
        <div className="text-gray-600 text-sm mt-2 line-clamp-3">
          <div
            dangerouslySetInnerHTML={{
              __html: truncateDescription(description || ""),
            }}
          />
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {tags?.map((tagItem) => (
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
      </div>
    </div>
  );
};

export default BlogPost;
