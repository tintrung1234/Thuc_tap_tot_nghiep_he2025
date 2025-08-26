import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { publicApi } from "../api/axios";
import PostItem from "../components/PostItem";
import PaginationControls from "../components/PaginationControls.jsx";
import JoinSection from "../components/JoinSection";
import BlogSkeleton from "../components/BlogSkeleton";
import { toast } from "react-toastify";

const TagPage = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPostsByTag = async () => {
      try {
        const response = await publicApi.get(`/posts/tags/${slug}`);
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
        toast.error("Không thể tải bài viết. Vui lòng thử lại sau!");
        console.error("Error fetching posts by tag:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostsByTag();
  }, [slug]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Tags {"#" + slug.toLocaleLowerCase()}
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
