import React from "react";
import { useNavigate } from "react-router-dom";

const JoinSection = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/author`);
  };
  return (
    <div
      className="mt-12 max-w-md mx-auto text-center mb-12"
      data-aos="fade-up"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Join our team to be a part of our story
      </h3>
      <p className="text-gray-600 mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt.
      </p>
      <button
        className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500"
        onClick={() => {
          handleClick();
        }}
      >
        Join Now
      </button>
    </div>
  );
};

export default JoinSection;
