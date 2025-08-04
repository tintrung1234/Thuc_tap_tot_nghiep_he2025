import React from "react";
import { useNavigate } from "react-router-dom";
import shuttle from "../assets/shuttle.png";
import business from "../assets/business.png";
import economy from "../assets/economy.png";
import cyborg from "../assets/cyborg.png";

const CategoryList = () => {
  const navigate = useNavigate();

  const image = [business, shuttle, economy, cyborg];

  const categories = [
    { name: "Business" },
    { name: "Startup" },
    { name: "Economy" },
    { name: "Technology" },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <div data-aos="zoom-in">
      {/* Category */}
      <h3 className="font-bold text-[26px] mb-4">Category</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="border-2 border-gray-200 p-4 hover:bg-yellow-400 cursor-pointer transition duration-300"
            onClick={() => handleCategoryClick(category.name)}
          >
            {/* Icon + Title */}
            <div className="items-center mb-2">
              <div className="w-[45px] h-[45px] bg-gray-100 flex items-center justify-center mb-3">
                <img
                  src={image[index]}
                  alt={category.name}
                  className="w-[25px] h-[25px] object-contain"
                />
              </div>
              <h2 className="font-bold text-lg">{category.name}</h2>
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
