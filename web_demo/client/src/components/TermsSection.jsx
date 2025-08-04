import React from "react";

const TermsSection = ({ section }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {section.title}
      </h2>
      <div className="mt-2 text-gray-800 space-y-4 text-lg">
        <p className="whitespace-pre-line leading-relaxed ">
          {section.content}
        </p>
      </div>
    </div>
  );
};

export default TermsSection;
