import { useState, useEffect, useMemo } from "react";
import PostTable from "../components/PostTable";
import DetailPostModal from "../components/DetailPostModal";
import EditPostModal from "../components/EditPostModal";
import { publicApi, privateApi } from "../../api/axios";
import { toast } from "react-toastify";

function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState({
    posts: true,
    categories: true,
    tags: true,
  });
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showDetailPostModal, setShowDetailPostModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [postSearchTerm, setPostSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts, categories, and tags in parallel
        const [postsRes, categoriesRes, tagsRes] = await Promise.all([
          publicApi.get("/posts"),
          publicApi.get("/categories?page=1&limit=100"),
          publicApi.get("/tags?page=1&limit=100"),
        ]);

        // Format posts
        const formattedPosts = postsRes.data.posts.map((post) => ({
          id: post._id,
          title: post.title,
          slug: post.slug,
          author: post.uid.username || "Unknown",
          date: new Date(post.createdAt).toISOString().split("T")[0],
          tags: post.tags || [],
          category: post.category || null,
          description: post.description,
          content: post.content,
          views: post.views || 0,
        }));
        setPosts(formattedPosts);
        setLoading((prev) => ({ ...prev, posts: false }));

        // Set categories
        setCategories(categoriesRes.data.categories);
        setLoading((prev) => ({ ...prev, categories: false }));

        // Set tags
        setTags(tagsRes.data.tags);
        setLoading((prev) => ({ ...prev, tags: false }));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Không thể tải dữ liệu! Vui lòng thử lại.");
        setLoading({
          posts: false,
          categories: false,
          tags: false,
        });
      }
    };

    fetchData();
  }, []);

  const handleEditPost = async (e, postData) => {
    e.preventDefault();
    const updatedPost = {
      title: postData.title,
      description: postData.description,
      category: postData.category?._id || postData.category,
      tags: postData.tags.map((tag) => tag._id || tag),
      content: postData.content,
    };
    try {
      const response = await privateApi.put(
        `/posts/update/${currentPost.slug}`,
        updatedPost
      );
      toast.success(response.data.message);

      // Refresh posts
      const postsRes = await publicApi.get("/posts");
      const formattedPosts = postsRes.data.posts.map((post) => ({
        id: post._id,
        title: post.title,
        slug: post.slug,
        author: post.uid.username || "Unknown",
        date: new Date(post.createdAt).toISOString().split("T")[0],
        tags: post.tags || [],
        category: post.category || null,
        description: post.description,
        content: post.content,
        views: post.views || 0,
      }));
      setPosts(formattedPosts);
      setShowEditPostModal(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      toast.error(error.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  const handleDeletePost = async (slug) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        const response = await privateApi.delete(`/posts/${slug}`);
        toast.success(response.data.message);
        // setPosts(posts.filter((p) => p.slug !== slug));
        setShowDetailPostModal(false);
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
        toast.error(error.response?.data?.message || "Xóa thất bại!");
      }
    }
  };

  const openDetailPostModal = (post) => {
    setCurrentPost(post);
    setShowDetailPostModal(true);
  };

  const openEditPostModal = (post) => {
    setCurrentPost(post);
    setShowEditPostModal(true);
    setShowDetailPostModal(false);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = postSearchTerm
        ? post.title.toLowerCase().includes(postSearchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.name.toLowerCase().includes(postSearchTerm.toLowerCase())
          )
        : true;
      const matchesTag = selectedTag
        ? post.tags.some(
            (tag) => tag._id === selectedTag || tag === selectedTag
          )
        : true;
      const matchesCategory = selectedCategory
        ? post.category?._id === selectedCategory ||
          post.category === selectedCategory
        : true;
      const matchesDate =
        startDate && endDate
          ? new Date(post.date) >= new Date(startDate) &&
            new Date(post.date) <= new Date(endDate)
          : true;
      return matchesSearch && matchesTag && matchesCategory && matchesDate;
    });
  }, [
    posts,
    postSearchTerm,
    selectedTag,
    selectedCategory,
    startDate,
    endDate,
  ]);

  const uniqueTags = useMemo(
    () => [...tags].sort((a, b) => a.name.localeCompare(b.name)),
    [tags]
  );
  const uniqueCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  return (
    <div className="flex flex-col flex-1 overflow-x-auto min-h-screen bg-gray-100 p-4">
      <main className="bg-white rounded-lg shadow-md p-6">
        {loading.posts || loading.categories || loading.tags ? (
          <div className="text-gray-500 text-center py-4">
            Đang tải dữ liệu...
          </div>
        ) : (
          <PostTable
            posts={filteredPosts}
            postSearchTerm={postSearchTerm}
            setPostSearchTerm={setPostSearchTerm}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            uniqueTags={uniqueTags}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            uniqueCategories={uniqueCategories}
            openDetailPostModal={openDetailPostModal}
            openEditPostModal={openEditPostModal}
            handleDeletePost={handleDeletePost}
          />
        )}
      </main>

      <DetailPostModal
        showDetailPostModal={showDetailPostModal}
        setShowDetailPostModal={setShowDetailPostModal}
        currentPost={currentPost}
        openEditPostModal={openEditPostModal}
        handleDeletePost={handleDeletePost}
      />
      <EditPostModal
        showEditPostModal={showEditPostModal}
        setShowEditPostModal={setShowEditPostModal}
        currentPost={currentPost}
        handleEditPost={handleEditPost}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}

export default PostManagement;
