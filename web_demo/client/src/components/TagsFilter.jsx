import React from "react";

const TagsFilter = ({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Bộ lọc</h2>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Danh mục</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange("")}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === ""
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onCategoryChange(cat._id)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === cat._id
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTagChange("")}
            className={`px-4 py-2 rounded-lg ${
              selectedTag === ""
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Tất cả
          </button>
          {tags.map((tag) => (
            <button
              key={tag._id}
              onClick={() => onTagChange(tag._id)}
              className={`px-4 py-2 rounded-lg ${
                selectedTag === tag._id
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsFilter;
