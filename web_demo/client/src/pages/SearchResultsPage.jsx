import React, { useState, useEffect } from "react";
import BlogPost from "../components/BlogPost";
import TagsFilter from "../components/TagsFilter";
import { publicApi } from "../api/axios";
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
  const [ragAnswer, setRagAnswer] = useState("");
  const [relatedChunks, setRelatedChunks] = useState([]);
  const postsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await publicApi.get("/categories");
        setCategories(categoriesResponse.data.categories);

        // Fetch tags
        const tagsResponse = await publicApi.get("/tags?limit=10");
        setTags(tagsResponse.data.tags);

        // Fetch posts
        const q = searchParams.get("q") || "";
        const dataResponse = await publicApi.post("/search", { query: q });

        const postsData = dataResponse.data.chunks || [];

        // Reset to first page when new search is performed
        setCurrentPage(1);

        // Fetch counts for all posts in bulk
        const postIds = postsData.map((post) => post._id);
        const countsResponse = Math.ceil(postIds.length);

        const counts = countsResponse.data || [];

        const postsWithCounts = postsData.map((post) => {
          const countData = counts.find((c) => c.postId === post._id) || {};
          return {
            ...post,
            reactions: countData.reactions || 0,
            comments: countData.comments || 0,
          };
        });

        setPosts(postsWithCounts);

        // Fetch RAG search if query is a question
        if (isQuestion(q)) {
          setRagAnswer(
            dataResponse.data.answer || "Không có câu trả lời phù hợp."
          );
        }
        setRelatedChunks(dataResponse.data.chunks || []);
      } catch (error) {
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau!");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const tag = searchParams.get("tag") || "";
    setSearchQuery(query);
    setSelectedCategory(category);
    setSelectedTag(tag);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchParams]);

  // Client-side filtering for posts
  useEffect(() => {
    let filtered = posts;

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Check if query is a question
  const isQuestion = (q) => {
    return q.trim().endsWith("?") || q.trim().split(" ").length > 3;
  };

  // Combine posts with relatedChunks from RAG
  const combinedPostsRaw = [
    ...filteredPosts,
    ...relatedChunks.map((chunk) => ({
      _id: chunk.metadata.post_id,
      title: chunk.metadata.title,
      slug: chunk.metadata.url.split("/").pop(),
      description: chunk.content.substring(0, 200) + "...",
      content: chunk.content,
      category: chunk.metadata.category || {},
      tags: chunk.metadata.tags || [],
      imageUrl: chunk.metadata.imageUrl || "",
      uid: chunk.metadata.uid || {},
      reactions: 0,
      comments: 0,
    })),
  ];

  // Loại bỏ bài viết trùng ID, ưu tiên giữ relatedChunks
  const combinedPosts = Array.from(
    new Map(combinedPostsRaw.map((post) => [post._id, post])).values()
  );

  // Pagination logic
  const totalPosts = combinedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = combinedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-8" data-aos="fade-up">
      <h1 className="text-3xl font-bold mb-8">
        Kết quả tìm kiếm cho "{searchQuery || "Tất cả"}"
      </h1>

      {/* Display LLM answer if query is a question */}
      {ragAnswer !== "Không có câu trả lời phù hợp." && (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">
            Câu trả lời thông minh:
          </h2>
          <p className="text-gray-700">{ragAnswer}</p>
        </div>
      )}


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
                  reactions={post.reactions}
                  comments={post.comments}
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
