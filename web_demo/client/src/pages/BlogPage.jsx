import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostItem from "../components/PostItem";
import PaginationControls from "../components/PaginationControls";
import JoinSection from "../components/JoinSection";
import CategoryList from "../components/CategoryList";
import BlogSkeleton from "../components/BlogSkeleton";
import TopPostSkeleton from "../components/TopPostSkeleton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function BlogPage() {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [topPost, setTopPost] = useState(null);
  const [authorNames, setAuthorNames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getAllPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/posts`);
        setPosts(response.data);
      } catch (error) {
        toast.error("Không thể tải danh sách bài viết. Vui lòng thử lại sau!");
        console.error("Error fetching all posts:", error);
      } finally {
        setLoading(false);
      }
    };
    getAllPosts();
  }, [category]); // Added category to dependency array to refetch if category changes

  // Fetch top post
  useEffect(() => {
    const getTopPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/topblog`
        );
        setTopPost(response.data); // Assuming single object from .findOne()
      } catch (error) {
        toast.error("Không thể tải dữ liệu bài biết top 1!");
        console.error("Error fetching top blog:", error);
      } finally {
        setLoading(false);
      }
    };
    getTopPost();
  }, []);

  const fetchUserName = async (uid) => {
    if (!uid || authorNames[uid]) return; // Skip if no UID or already fetched

    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/profile/${uid}`
      );
      setAuthorNames((prev) => ({
        ...prev,
        [uid]: response.data.username,
      }));
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Không thể tải thông tin người dùng!");
    }
  };

  useEffect(() => {
    if (topPost && topPost.uid) {
      fetchUserName(topPost.uid);
    }
  }, [topPost]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDetailClick = (_id) => {
    navigate(`/detail/${encodeURIComponent(_id)}`);
  };

  const truncateDescription = (html, maxLength) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    if (text.length <= maxLength) return html;
    return (
      `${text.substring(0, maxLength)}...` +
      div.innerHTML.substring(0, div.innerHTML.indexOf(">", maxLength))
    );
  };

  return (
    <div>
      <div className="w-full mx-auto" data-aos="fade-up">
        {topPost ? (
          <div className="bg-[#f4f0fa] py-4 px-6 md:px-16">
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
                      {authorNames[topPost?.uid] || "Tác giả không xác định"}
                    </span>{" "}
                    | {new Date(topPost.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <h2
                  className="mr-1 w-[50vw] max-h-[50vh] overflow-y-auto mt-2 mb-4"
                  style={{ maxHeight: "50vh" }} // Fallback for older browsers
                  dangerouslySetInnerHTML={{
                    __html:
                      truncateDescription(topPost?.description || "", 200) ||
                      "",
                  }}
                ></h2>
                <button
                  className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-sm hover:bg-yellow-500 transition duration-200"
                  onClick={() => {
                    handleDetailClick(topPost._id);
                  }}
                >
                  Xem thêm {">"}
                </button>
              </div>

              <div className="flex justify-center">
                <img
                  src={topPost.imageUrl}
                  alt="Featured Post"
                  className="w-full max-w-md shadow"
                />
              </div>
            </div>
          </div>
        ) : (
          <TopPostSkeleton />
        )}

        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">All posts</h1>
          <hr className="border-t border-gray-300 mb-6" />
          {loading ? (
            <BlogSkeleton count={postsPerPage} />
          ) : currentPosts.length > 0 ? (
            <>
              {currentPosts.map((post) => (
                <PostItem key={post._id || post.title} post={post} />
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
