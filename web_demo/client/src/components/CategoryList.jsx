import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { publicApi } from "../api/axios";
import { categoryIcons } from "../utils/getCategoryIcon";

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await publicApi.get("/categories?page=1&limit=10");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug) => {
    navigate(`/category/${encodeURIComponent(categorySlug)}`);
  };

  return (
    <div data-aos="zoom-in">
      <h3 className="font-bold text-[26px] mb-4">Category</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.length > 0 ? (
          categories.map((category) => {
            const Icon =
              categoryIcons[category.slug] || categoryIcons["default"];
            return (
              <div
                key={category._id}
                className="border-2 border-gray-200 p-4 hover:bg-yellow-400 cursor-pointer transition duration-300"
                onClick={() => handleCategoryClick(category.slug)}
              >
                <div className="items-center mb-2">
                  <div className="w-[45px] h-[45px] bg-gray-100 flex items-center justify-center mb-3 rounded">
                    {Icon ? (
                      <Icon className="w-[25px] h-[25px] text-gray-700" />
                    ) : (
                      <div className="w-[25px] h-[25px] bg-gray-300 rounded" />
                    )}
                  </div>
                  <h2 className="font-bold text-lg">{category.name}</h2>
                </div>

                <p className="text-gray-500 text-sm">
                  {category.description || "No description available"}
                </p>
              </div>
            );
          })
        ) : (
          <p>Đang tải danh mục...</p>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
