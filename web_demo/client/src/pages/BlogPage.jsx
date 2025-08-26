import React, { useState, useEffect } from "react";
import { publicApi } from "../api/axios";
import PostItem from "../components/PostItem";
import PaginationControls from "../components/PaginationControls";
import JoinSection from "../components/JoinSection";
import CategoryList from "../components/CategoryList";
import BlogSkeleton from "../components/BlogSkeleton";
import TopPostSkeleton from "../components/TopPostSkeleton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShare, FaComment } from "react-icons/fa";

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingTopPost, setLoadingTopPost] = useState(true);
  const [topPost, setTopPost] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Fetch all posts with pagination and counts
  useEffect(() => {
    const getAllPosts = async () => {
      setLoadingPosts(true);
      try {
        const response = await publicApi.get(
          `/posts?page=${currentPage}&limit=${postsPerPage}`
        );
        const postsData = response.data.posts || [];

        // Fetch counts for all posts in bulk
        const postIds = postsData.map((post) => post._id);
        const countsResponse = await publicApi.post(`/posts/counts`, {
          postIds,
        });
        const counts = countsResponse.data;

        const postsWithCounts = postsData.map((post) => {
          const countData = counts.find((c) => c.postId === post._id) || {};
          return {
            ...post,
            reactions: countData.reactions || 0,
            shares: countData.shares || 0,
            comments: countData.comments || 0,
          };
        });

        setPosts(postsWithCounts);
        setTotalPages(Math.ceil(response.data.total / postsPerPage));
      } catch (error) {
        toast.error("Không thể tải danh sách bài viết. Vui lòng thử lại sau!");
        console.error("Error fetching all posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    getAllPosts();
  }, [currentPage]);

  // Fetch top post with counts
  useEffect(() => {
    const getTopPost = async () => {
      setLoadingTopPost(true);
      try {
        const response = await publicApi.get(`/posts/top`);
        const topPostData = response.data;

        if (topPostData) {
          const countsResponse = await publicApi.post(`/posts/counts`, {
            postIds: [topPostData._id],
          });
          const countData = countsResponse.data[0] || {};

          setTopPost({
            ...topPostData,
            reactions: countData.reactions || 0,
            shares: countData.shares || 0,
            comments: countData.comments || 0,
          });
        } else {
          setTopPost(null);
        }
      } catch (error) {
        toast.error("Không thể tải dữ liệu bài viết top 1!");
        console.error("Error fetching top blog:", error);
        setTopPost(null);
      } finally {
        setLoadingTopPost(false);
      }
    };
    getTopPost();
  }, []);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDetailClick = (slug) => {
    navigate(`/detail/${encodeURIComponent(slug)}`);
  };

  const truncateDescription = (html, maxLength) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    if (text.length <= maxLength) return html;
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <div>
      <div className="w-full mx-auto" data-aos="fade-up">
        {/* Featured Post */}
        {loadingTopPost ? (
          <TopPostSkeleton />
        ) : topPost ? (
          <div className="bg-[#e6ddf4] py-4 px-6 md:px-16 md:py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="uppercase tracking-wide text-sm text-gray-600 mb-2">
                  Featured Post
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {topPost.title}
                </h2>
                <div className="flex text-sm text-gray-500 mb-4">
                  <p>
                    By{" "}
                    <span className="text-blue-600 font-medium">
                      {topPost?.uid?.username || "Tác giả không xác định"}
                    </span>{" "}
                    | {new Date(topPost.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <h2
                  className="mr-1 w-full overflow-y-auto mt-2 mb-4"
                  dangerouslySetInnerHTML={{
                    __html:
                      truncateDescription(topPost?.description || "", 200) ||
                      "",
                  }}
                ></h2>
                <div className="mt-3 flex items-center gap-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-1">
                    <FaHeart className="text-red-500" />{" "}
                    {topPost.reactions || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaShare className="text-blue-500" /> {topPost.shares || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaComment className="text-gray-500" />{" "}
                    {topPost.comments || 0}
                  </span>
                </div>
                <button
                  className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-sm hover:bg-yellow-500 transition duration-200 mt-4"
                  onClick={() => handleDetailClick(topPost.slug)}
                >
                  Xem thêm {">"}
                </button>
              </div>
              <div className="flex justify-center">
                <img
                  src={topPost.imageUrl}
                  alt="Featured Post"
                  className="w-full h-[60vh] max-w-md shadow"
                />
              </div>
            </div>
          </div>
        ) : null}

        {/* All Posts */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">All posts</h1>
          <hr className="border-t border-gray-300 mb-6" />
          {loadingPosts ? (
            <BlogSkeleton count={postsPerPage} />
          ) : posts.length > 0 ? (
            <>
              {posts.map((post) => (
                <PostItem key={post._id} post={post} />
              ))}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={handlePrev}
                onNext={handleNext}
              />
              <CategoryList />
            </>
          ) : (
            <div>
              <p>Không thể tải dữ liệu. Vui lòng thử lại sau!</p>
              <CategoryList />
            </div>
          )}
          <JoinSection />
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
