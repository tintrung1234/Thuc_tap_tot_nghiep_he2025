import React from "react";

const PaginationControls = ({ currentPage, totalPages, onPrev, onNext }) => {
  return (
    <div className="flex justify-center items-center space-x-4 mb-6">
      <button
        onClick={onPrev}
        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        disabled={currentPage === 1}
      >
        Prev
      </button>
      <span className="text-gray-600">
        {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNext}
        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
