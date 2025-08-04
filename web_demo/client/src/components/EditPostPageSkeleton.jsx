const EditPostPageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-6 animate-pulse">
    <div data-aos="fade-up">
      {/* User Info Skeleton */}
      <div className="w-full py-8 flex justify-center">
        <div className="max-w-4xl p-4 flex justify-center">
          <div className="flex-col">
            <div className="flex items-center w-full">
              <div className="h-[75px] w-[73px] rounded-full bg-gray-300 mr-4"></div>
              <div className="h-8 bg-gray-300 w-1/3"></div>
            </div>
            <div className="h-10 bg-gray-300 w-2/3 mt-3"></div>
          </div>
        </div>
      </div>
      {/* Form Skeleton */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-8">
        <div className="h-10 bg-gray-300 rounded-md"></div>
        {/* Category Skeleton */}
        <div className="p-3">
          <div className="h-8 bg-gray-300 w-1/4 mb-4"></div>
          <div className="p-4 flex justify-between gap-3">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="w-80 h-33 flex items-center p-3 mt-2 border-2 border-gray-200 bg-gray-300"
              ></div>
            ))}
          </div>
        </div>
        {/* Tags Skeleton */}
        <div className="p-3">
          <div className="h-8 bg-gray-300 w-1/4 mb-4"></div>
          <div className="p-4 flex justify-center">
            <div className="grid grid-cols-4 justify-start w-3/4">
              {[...Array(7)].map((_, index) => (
                <div
                  key={index}
                  className="hoverBehavior activeBehavior h-33 flex items-center justify-center p-3 mt-2 border-2 border-gray-200 bg-gray-300 rounded-[2vw] mr-3"
                ></div>
              ))}
              <div className="hoverBehavior h-33 flex items-center justify-center p-3 mt-2 border-2 border-gray-200 bg-gray-300 rounded-[2vw] mr-3"></div>
            </div>
          </div>
        </div>
        {/* Image Skeleton */}
        <div>
          <div className="h-6 bg-gray-300 w-1/6 mb-2"></div>
          <div className="h-10 bg-gray-300 w-full mb-2"></div>
          <div className="h-32 w-32 bg-gray-300 rounded"></div>
        </div>
        {/* Body Skeleton */}
        <div>
          <div className="h-6 bg-gray-300 w-1/6 mb-2"></div>
          <div className="h-40 bg-gray-300 rounded-md"></div>
        </div>
        {/* Button Skeleton */}
        <div className="h-12 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  </div>
);

export default EditPostPageSkeleton;
