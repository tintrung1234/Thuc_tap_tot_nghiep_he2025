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
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/category/${encodeURIComponent(
            category
          )}`
        );
        setPosts(response.data);
      } catch (error) {
        toast.error("Không thể tải bài viết. Vui lòng thử lại sau!");
        console.error("Error fetching posts by category:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostsByCategory();
  }, [category]);

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{category}</h1>
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
          <p>Không thể tải dữ liệu. Vui lòng thử lại sau!.</p>
          <CategoryList />
        </div>
      )}

      <JoinSection />
    </div>
  );
};

export default CategoryPage;
