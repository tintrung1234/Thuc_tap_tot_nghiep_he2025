const AuthorSkeleton = () => (
  <div className="bg-gray-50 min-h-screen font-sans text-center p-6 animate-pulse">
    <section className="bg-purple py-12 px-6 md:px-20 flex flex-col justify-center md:flex-row items-center gap-10">
      <div className="w-36 h-36 md:w-48 md:h-48 bg-gray-300 rounded-full"></div>
      <div>
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </section>
    <div className="top-0 left-0 w-full h-[15px] flex justify-center overflow-hidden -translate-y-4">
      <div className="bg-gray-300 w-2/5 h-full"></div>
      <div className="bg-gray-300 w-60 h-full"></div>
    </div>
    <section className="px-6 py-12 max-w-7xl">
      <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
      <div className="space-y-6">
        {Array.from({ length: 5 }, (_, index) => (
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
    </section>
  </div>
);

export default AuthorSkeleton;
