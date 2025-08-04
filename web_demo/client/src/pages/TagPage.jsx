import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostItem from "../components/PostItem";
import PaginationControls from "../components/PaginationControls.jsx";
import JoinSection from "../components/JoinSection";
import BlogSkeleton from "../components/BlogSkeleton";
import { toast } from "react-toastify";

const TagPage = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostsByTag = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/tag/${encodeURIComponent(tag)}`
        );
        setPosts(response.data);
      } catch (error) {
        toast.error("Không thể tải bài viết. Vui lòng thử lại sau!");
        console.error("Error fetching posts by tag:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostsByTag();
  }, [tag]);

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
    <div className="max-w-5xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Tags {tag}</h1>
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
        </>
      ) : (
        <div>
          <p>Không thể tải dữ liệu. Vui lòng thử lại sau!.</p>
        </div>
      )}
      <JoinSection />
    </div>
  );
};

export default TagPage;
