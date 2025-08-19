import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostItem from "../components/PostItem";
import PaginationControls from "../components/PaginationControls";
import JoinSection from "../components/JoinSection";
import CategoryList from "../components/CategoryList";
import BlogSkeleton from "../components/BlogSkeleton";
import { toast } from "react-toastify";

const CategoryPage = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/category/${slug}`
        );
        setPosts(response.data.posts || []);
        setTotalPages(Math.ceil(response.data.total / postsPerPage));
      } catch (error) {
        toast.error("Không thể tải bài viết. Vui lòng thử lại sau!");
        console.error("Error fetching posts by category:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostsByCategory();
  }, [slug, currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        {posts[0]?.category?.name || "Danh mục không xác định"}
      </h1>
      <hr className="border-t border-gray-300 mb-6" />
      {loading ? (
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
          <p>Không thể tải dữ liệu. Vui lòng thử lại sau!.</p>
          <CategoryList />
        </div>
      )}

      <JoinSection />
    </div>
  );
};

export default CategoryPage;
