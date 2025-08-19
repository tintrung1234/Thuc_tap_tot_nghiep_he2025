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
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const postsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await axios.get(
          "http://localhost:5000/api/categories"
        );
        setCategories(categoriesResponse.data.categories);

        // Fetch tags
        const tagsResponse = await axios.get(
          "http://localhost:5000/api/tags?limit=10"
        );
        setTags(tagsResponse.data.tags);

        // Fetch posts
        const params = new URLSearchParams();
        if (searchQuery) params.append("q", searchQuery);
        if (selectedCategory) params.append("category", selectedCategory);
        if (selectedTag) params.append("tags", selectedTag);
        const postsResponse = await axios.get(
          `http://localhost:5000/api/posts/search?${params.toString()}`
        );
        setPosts(postsResponse.data);
      } catch (error) {
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau!");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery, selectedCategory, selectedTag]);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const tag = searchParams.get("tag") || "";
    setSearchQuery(query);
    setSelectedCategory(category);
    setSelectedTag(tag);
  }, [searchParams]);

  // Client-side filtering
  useEffect(() => {
    let filtered = posts;

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (post) => post.category._id === selectedCategory
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((post) =>
        post.tags.some((tag) => tag._id === selectedTag)
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedCategory, selectedTag]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-8" data-aos="fade-up">
      <h1 className="text-3xl font-bold mb-8">
        Kết quả tìm kiếm cho "{searchQuery || "Tất cả"}"
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          {loading ? (
            <BlogSkeleton count={postsPerPage} />
          ) : currentPosts.length > 0 ? (
            <>
              {currentPosts.map((post) => (
                <BlogPost
                  key={post._id}
                  slug={post.slug}
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
            <p>Không tìm thấy bài viết nào phù hợp.</p>
          )}
        </div>
        <div>
          <TagsFilter
            categories={categories}
            tags={tags}
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
