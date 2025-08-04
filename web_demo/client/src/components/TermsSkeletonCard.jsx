import React from "react";

const TermsSkeletonCard = () => {
  return (
    <div className="animate-pulse mb-6">
      <div className="h-6 bg-gray-300 rounded w-2/3 mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-11/12" />
        <div className="h-4 bg-gray-200 rounded w-10/12" />
        <div className="h-4 bg-gray-200 rounded w-9/12" />
      </div>
    </div>
  );
};

export default TermsSkeletonCard;
