import React, { useState, useEffect } from "react";
import BlogPost from "../components/BlogPost";
import TagsFilter from "../components/TagsFilter";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import BlogSkeleton from "../components/BlogSkeleton";
import { toast } from "react-toastify";
import PaginationControls from "../components/PaginationControls";

const SearchResultsPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const postsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("q", searchQuery);
        if (selectedCategory) params.append("category", selectedCategory);
        if (selectedTag) params.append("tags", selectedTag);
        const response = await axios.get(
          `http://localhost:5000/api/posts/search?${params.toString()}`
        );
        setPosts(response.data);
      } catch (error) {
        toast.error("Không thể tải bài viết. Vui lòng thử lại sau!");
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [searchQuery, selectedCategory, selectedTag]);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) setSearchQuery(query);
    const category = searchParams.get("category");
    if (category) setSelectedCategory(category);
    const tag = searchParams.get("tag");
    if (tag) setSelectedTag(tag);
  }, [searchParams]);

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
    <main className="max-w-6xl mx-auto px-6 py-8" data-aos="fade-up">
      <h1 className="text-3xl font-bold mb-8">
        Kết quả tìm kiếm cho "{searchQuery}"
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          {loading ? (
            <BlogSkeleton coutnt={postsPerPage} />
          ) : currentPosts.length > 0 ? (
            <>
              {currentPosts.map((post, index) => (
                <BlogPost
                  key={index}
                  id={post._id}
                  category={post.category}
                  title={post.title}
                  description={post.description}
                  tags={post.tags || []}
                  imageUrl={post.imageUrl}
                  author={post.uid}
                />
              ))}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            </>
          ) : (
            <p>Không thể tải dữ liệu. Vui lòng thử lại sau!.</p>
          )}
        </div>
        <div>
          <TagsFilter
            posts={posts}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            onCategoryChange={setSelectedCategory}
            onTagChange={setSelectedTag}
          />
        </div>
      </div>
    </main>
  );
};

export default SearchResultsPage;
