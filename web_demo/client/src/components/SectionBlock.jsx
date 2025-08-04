import React from "react";

const SectionBlock = ({ image, title, subtitle, content, reverse = false }) => {
  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-8 mb-12 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
      data-aos={reverse ? "fade-left" : "fade-left"}
    >
      <div className="flex-1">
        <img
          src={image}
          alt={title}
          className="max-w-full w-full h-64 object-cover rounded-lg shadow-md"
        />
      </div>
      <div className="flex-1 flex items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{subtitle}</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionBlock;
