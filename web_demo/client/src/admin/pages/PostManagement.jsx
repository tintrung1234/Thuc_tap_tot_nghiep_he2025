import { useState, useEffect, useMemo } from "react";
import PostTable from "../components/PostTable";
import DetailPostModal from "../components/DetailPostModal";
import EditPostModal from "../components/EditPostModal";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showDetailPostModal, setShowDetailPostModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [postSearchTerm, setPostSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get("http://localhost:5000/api/users");
        const formattedUsers = usersRes.data.map((user) => ({
          uid: user.uid,
          name: user.username,
        }));
        setUsers(formattedUsers);

        const postsRes = await axios.get("http://localhost:5000/api/posts");
        const formattedPosts = postsRes.data.map((post) => ({
          id: post._id,
          title: post.title,
          authorId: post.uid,
          author:
            formattedUsers.find((u) => u.uid === post.uid)?.name || "Unknown",
          date: new Date(post.createdAt).toISOString().split("T")[0],
          tags: post.tags || [],
          category: post.category || null,
          description: post.description,
          likes: post.likes || 0,
        }));
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ MongoDB:", error);
        toast.error("Không thể tải danh sách bài viết hoặc người dùng!");
      }
    };

    fetchData();
  }, []);

  const handleEditPost = async (e, postData) => {
    e.preventDefault();
    const user = auth.currentUser;
    const token = await user.getIdToken();
    const updatedPost = {
      title: postData.title,
      description: postData.description,
      category: postData.category,
      tags: postData.tags,
    };
    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/update/${currentPost.id}`,
        updatedPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);

      // Refresh posts
      const postsRes = await axios.get("http://localhost:5000/api/posts");
      const formattedPosts = postsRes.data.map((post) => ({
        id: post._id,
        title: post.title,
        authorId: post.uid,
        author: users.find((u) => u.uid === post.uid)?.name || "Unknown",
        date: new Date(post.createdAt).toISOString().split("T")[0],
        tags: post.tags || [],
        category: post.category || null,
        description: post.description,
        likes: post.likes || 0,
      }));
      setPosts(formattedPosts);

      setShowEditPostModal(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      toast.error(error.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        const user = auth.currentUser;
        const token = await user.getIdToken();
        const response = await axios.delete(
          `http://localhost:5000/api/posts/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(response.data.message);

        // Remove deleted post from state
        setPosts(posts.filter((p) => p.id !== id));
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
          tag.toLowerCase().includes(postSearchTerm.toLowerCase())
        )
        : true;
      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
      const matchesCategory = selectedCategory
        ? post.category === selectedCategory
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

  const uniqueTags = [...new Set(posts.flatMap((post) => post.tags))].sort();
  const uniqueCategories = [...new Set(posts.map((post) => post.category))]
    .filter((category) => category)
    .sort();

  return (
    <div className="flex-col flex flex-1 overflow-x-auto min-h-screen bg-gray-100 p-4">
      <main className="bg-white rounded-lg shadow-md p-6">
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
          filteredPosts={filteredPosts}
          setEndDate={setEndDate}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          uniqueCategories={uniqueCategories}
          openDetailPostModal={openDetailPostModal}
          openEditPostModal={openEditPostModal}
          handleDeletePost={handleDeletePost}
        />
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
      />
    </div>
  );
}

export default PostManagement;
