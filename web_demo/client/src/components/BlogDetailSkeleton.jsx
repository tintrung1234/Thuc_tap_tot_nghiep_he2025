import React from "react";

const BlogSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto my-10 px-6 py-10 bg-purple border border-black shadow-md animate-pulse">
      {/* Author Skeleton */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div>
          <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-32"></div>
        </div>
      </div>

      {/* Title Skeleton */}
      <div className="h-8 bg-gray-300 rounded mb-4"></div>

      {/* Category Skeleton */}
      <div className="flex items-center space-x-1 mb-4">
        <div className="w-5 h-5 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </div>

      {/* Image Skeleton */}
      <div className="my-5 h-64 bg-gray-300 rounded-md"></div>

      {/* Description Skeleton */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
