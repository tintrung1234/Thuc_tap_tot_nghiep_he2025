const TopPostSkeleton = () => (
  <div
    className="bg-[#f4f0fa] bg-cover bg-center bg-no-repeat w-full h-screen text-white mb-24 pt-[10vh] pb-[10vh] pl-[5vw] animate-pulse"
    data-aos="fade-up"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
  >
    <div className="flex flex-col">
      <div className="flex mb-2">
        <div className="h-4 bg-gray-300 rounded w-1/6 mr-1"></div>{" "}
        {/* Category */}
        <div className="h-4 bg-gray-300 rounded w-1/6"></div>{" "}
        {/* Bold Category */}
      </div>

      <h1 className="font-bold w-[60vw] text-[3vw] mb-3">
        <div className="h-8 bg-gray-300 rounded w-full"></div> {/* Title */}
      </h1>

      <div className="flex text-lg mb-3">
        <div className="h-4 bg-gray-300 rounded w-1/12 mr-1"></div> {/* BY */}
        <div className="h-4 bg-gray-300 rounded w-1/6 mr-1"></div>{" "}
        {/* Author */}
        <div className="h-4 bg-gray-300 rounded w-1/12 mr-1"></div> {/* | */}
        <div className="h-4 bg-gray-300 rounded w-1/4"></div> {/* Date */}
      </div>

      <h2 className="mr-1 w-[50vw] max-h-[10vh] overflow-y-auto">
        <div className="h-12 bg-gray-300 rounded w-full mb-4"></div>{" "}
        {/* Description */}
      </h2>

      <div className="mt-10">
        <div className="h-10 bg-gray-300 rounded w-1/3"></div> {/* Button */}
      </div>
    </div>
  </div>
);

export default TopPostSkeleton;
