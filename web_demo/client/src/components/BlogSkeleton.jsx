import React from "react";

const BlogSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="animate-pulse flex space-x-4 mb-6">
          {/* Image Placeholder */}
          <div className="w-36 h-40 bg-gray-200 rounded"></div>
          {/* Text Content Placeholder */}
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>{" "}
            {/* Category */}
            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>{" "}
            {/* Title */}
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>{" "}
            {/* Description */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }, (_, tagIndex) => (
                <div
                  key={tagIndex}
                  className="h-4 bg-gray-200 rounded w-16"
                ></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogSkeleton;
