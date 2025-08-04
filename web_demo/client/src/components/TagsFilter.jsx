import React from "react";
import { getCategoryIcon } from "../utils/getCategoryIcon";

const TagsFilter = ({
  posts,
  searchQuery,
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange,
}) => {
  // Extract unique categories from posts
  // const allCategories = [...new Set(posts.map(post => post.category).filter(category => category))];

  // Define all possible categories
  const allCategories = ["Startup", "Business", "Economy", "Technology"];

  // Extract unique tags from posts
  // const allTags = [
  //   ...new Set(posts.flatMap((post) => post.tags || []).filter((tag) => tag)),
  // ];

  // Define all possible tags
  const allTags = [
    "Life",
    "Technology",
    "Business",
    "Marketing",
    "Starup",
    "Experience",
    "Screen",
  ];

  // Ensure only one filter (category or tag) is active at a time
  const handleCategoryClick = (category) => {
    onCategoryChange(category);
    onTagChange(""); // Clear tag selection when category is selected
  };

  const handleTagClick = (tag) => {
    onTagChange(tag);
    onCategoryChange(""); // Clear category selection when tag is selected
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">THỂ LOẠI</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {allCategories.length > 0 ? (
          allCategories.map((category) => (
            <button
              key={category}
              className={`text-black px-4 py-2 rounded flex items-center space-x-2 mb-4 ${
                selectedCategory === category
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {getCategoryIcon(category)}
              <span>{category}</span>
            </button>
          ))
        ) : (
          <p>Không có thể loại nào.</p>
        )}
      </div>

      <h3 className="text-lg font-semibold mt-4 mb-2">TẤT CẢ TAGS</h3>
      <div className="flex flex-wrap gap-2">
        {allTags.length > 0 ? (
          allTags.map((tag) => (
            <button
              key={tag}
              className={`border border-gray-300 text-gray-700 px-4 py-1 rounded ${
                selectedTag === tag
                  ? "bg-blue-400 text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))
        ) : (
          <p>Không có tags nào.</p>
        )}
      </div>
    </div>
  );
};

export default TagsFilter;
