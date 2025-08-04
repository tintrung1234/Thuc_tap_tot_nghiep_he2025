import { Link, useNavigate } from "react-router-dom";

const BlogPost = ({ id, category, title, description, tags, imageUrl }) => {
  const navigate = useNavigate();

  const handleDetailClick = (id) => {
    navigate(`/detail/${encodeURIComponent(id)}`);
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
      className="flex space-x-4 mb-6 cursor-pointer"
      data-aos="fade-right"
      onClick={() => {
        handleDetailClick(id);
      }}
    >
      <img
        src={imageUrl}
        alt="Blog post"
        className="w-36 h-50 object-cover rounded"
      />
      <div>
        <span className="text-purple-600 text-sm font-semibold">
          {category}
        </span>

        <h3 className="text-lg font-bold mt-1">{title}</h3>

        <div className="text-gray-600 text-sm mt-2">
          <h2
            className="mr-1 w-[50vw] max-h-[50vh] overflow-y-auto"
            style={{ maxHeight: "50vh" }} // Fallback for older browsers
            dangerouslySetInnerHTML={{
              __html: truncateDescription(description || "", 200) || "",
            }}
          ></h2>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags?.map((tag, index) => (
            <Link
              key={index}
              to={`/tags/${tag}`}
              className="text-blue-500 text-sm hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
