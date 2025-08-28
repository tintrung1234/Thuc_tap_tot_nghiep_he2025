import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "quill/dist/quill.snow.css";
import { publicApi, privateApi } from "../api/axios";
import { toast } from "react-toastify";
import Editor from "../components/Editor";
import EditPostPageSkeleton from "../components/EditPostPageSkeleton";
import ImagePostDropzone from "../components/ImagePostDropzone";
import RequireAuth from "../middleware/RequireAuth";
import { categoryIcons } from "../utils/getCategoryIcon";

const EditPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    category: "",
    tags: [],
  });
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarError, setAvatarError] = useState("");
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user?.uid) {
        toast.error("Vui lòng đăng nhập để chỉnh sửa bài viết!");
        navigate("/login");
        return;
      }

      try {
        // Fetch user profile
        const profileResponse = await privateApi.get(`/users/${user.uid}`);
        setProfile(profileResponse.data);

        // Fetch post details
        const postResponse = await privateApi.get(`/posts/${slug}`);
        const data = postResponse.data;
        setPost({
          title: data.title || "",
          description: data.description || "",
          content: data.content || "",
          imageUrl: data.imageUrl || "",
          category: data.category?._id || data.category || "",
          tags: data.tags?.map((tag) => tag._id || tag) || [],
        });
        setPreview(
          data.imageUrl ||
            "https://res.cloudinary.com/daeorkmlh/image/upload/v1750835215/No-Image-Placeholder.svg_v0th8g.png"
        );

        // Fetch categories
        const categoriesResponse = await publicApi.get("/categories");
        setCategories(categoriesResponse.data.categories);

        // Fetch latest 10 tags
        const tagsResponse = await publicApi.get("/tags?limit=10");
        setAvailableTags(tagsResponse.data.tags);
      } catch (error) {
        toast.error("Không thể tải dữ liệu!");
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, navigate]);

  const handleContentChange = (html) => {
    setPost((prevPost) => ({
      ...prevPost,
      content: html,
    }));
  };

  const handleCreateTag = async () => {
    if (!newTag.trim()) {
      toast.error("Vui lòng nhập tên tag!");
      return;
    }
    try {
      const response = await privateApi.post("/tags", { name: newTag });
      setAvailableTags((prev) => [...prev, response.data]);
      setPost((prevPost) => ({
        ...prevPost,
        tags: [...prevPost.tags, response.data._id],
      }));
      setNewTag("");
      toast.success("Tạo tag mới thành công!");
    } catch (error) {
      toast.error("Lỗi khi tạo tag mới!");
      console.error("Error creating tag:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user?.uid) {
      toast.error("Bạn chưa đăng nhập!");
      setLoading(false);
      navigate("/login");
      return;
    }

    if (!post.title || !post.description || !post.content || !post.category) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề, mô tả, nội dung và danh mục!");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("title", post.title);
      data.append("description", post.description);
      data.append("content", post.content);
      data.append("category", post.category);
      if (avatarFile) {
        data.append("image", avatarFile);
      }
      post.tags.forEach((tag) => data.append("tags", tag));

      await privateApi.put(`/posts/update/${slug}`, data);

      toast.success("Cập nhật bài viết thành công!");
      setTimeout(() => navigate(`/author`), 1000);
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Cập nhật bài viết thất bại!"
      );
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <EditPostPageSkeleton />;
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50">
        <div data-aos="fade-up">
          {/* User Info */}
          <div className="w-full p-4 flex justify-center">
            <div className="max-w-4xl p-4 flex justify-center">
              <div className="flex-col">
                <div className="flex items-center w-full">
                  <img
                    src={
                      profile?.photoUrl ||
                      "https://res.cloudinary.com/daeorkmlh/image/upload/v1750775424/avatar-trang-4_jjrbuu.jpg"
                    }
                    alt="useravatar"
                    className="h-[75px] w-[73px] rounded-full mr-4"
                  />
                  <h3 className="text-purple-700 font-bold text-[28px]">
                    {profile?.username || "Anonymous"}
                  </h3>
                </div>
                <h2 className="text-[34px] font-bold mt-3">
                  Hey {profile?.username || "Anonymous"}, bạn muốn chỉnh sửa gì
                  trong bài viết này?
                </h2>
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-2"
          >
            {/* Title */}
            <div className="p-3">
              <label className="font-bold text-[26px] sm:text-2xl mt-3">
                Tiêu đề
              </label>
              <textarea
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                placeholder="Nhập tiêu đề bài viết"
                className="mt-2 text-[20px] w-full border-3 border-gray-200 p-3 border border-gray-300 rounded-lg overflow-hidden resize-none"
                rows={1}
              />
            </div>

            {/* Category */}
            <div className="p-3">
              <h3 className="font-bold text-[22px] sm:text-2xl mb-2">
                Danh mục
              </h3>
              <div className="flex flex-wrap justify-center sm:justify-start gap-6 p-4">
                {categories.map((cat) => {
                  const Icon =
                    categoryIcons[cat.slug] || categoryIcons["default"];
                  return (
                    <div
                      key={cat._id}
                      onClick={() => setPost({ ...post, category: cat._id })}
                      className={`cursor-pointer flex items-center gap-3 px-4 py-2 border-2 rounded-xl transition-all ${
                        post.category === cat._id
                          ? "bg-yellow-400 border-gray-500"
                          : "border-gray-200"
                      }`}
                    >
                      {/* Icon */}
                      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100">
                        <Icon className="w-5 h-5 text-gray-700" />{" "}
                      </div>
                      <h2 className="font-medium text-base sm:text-lg">
                        {cat.name}
                      </h2>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            <div className="p-3">
              <h3 className="font-bold text-[26px] sm:text-2xl">Tags</h3>
              <div className="p-3 sm:p-4 md:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {availableTags.map((tag) => (
                    <div
                      key={tag._id}
                      onClick={() =>
                        setPost((prevPost) => {
                          const newTags = prevPost.tags.includes(tag._id)
                            ? prevPost.tags.filter((t) => t !== tag._id)
                            : [...prevPost.tags, tag._id];
                          return { ...prevPost, tags: newTags };
                        })
                      }
                      className={`hoverBehavior activeBehavior flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-colors ${
                        post.tags.includes(tag._id)
                          ? "bg-yellow-400 border-gray-500"
                          : "border-gray-200"
                      }`}
                    >
                      <h2 className="font-bold text-[18px]">#{tag.name}</h2>
                    </div>
                  ))}
                  {/* Add new tag */}
                  <div className="hoverBehavior activeBehavior flex items-center justify-between p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-300">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Thêm tag mới"
                      className="w-full p-1 text-sm border-none focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCreateTag}
                      className="ml-2 text-blue-600 font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="p-3">
              <label className="block font-bold text-[24px]">Hình ảnh</label>
              <ImagePostDropzone
                setAvatarFile={setAvatarFile}
                setPreview={setPreview}
                setAvatarError={setAvatarError}
              />
              {preview && (
                <div className="mt-2 flex items-center gap-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 object-cover rounded w-60 h-60"
                  />
                </div>
              )}
              {avatarError && (
                <p className="text-red-500 text-sm mt-1">{avatarError}</p>
              )}
            </div>

            {/* Description */}
            <div className="p-3">
              <label className="block font-bold text-[26px]">Mô tả</label>
              <textarea
                value={post.description}
                onChange={(e) =>
                  setPost((prevPost) => ({
                    ...prevPost,
                    description: e.target.value,
                  }))
                }
                placeholder="Viết nội dung tóm tắt tại đây"
                className="mt-2 text-[18px] w-full border-3 border-gray-200 p-3 min-h-[200px] border border-gray-300 rounded-lg"
              />
            </div>

            {/* Content */}
            <div className="p-3">
              <label className="block font-bold text-[26px]">Nội dung</label>
              <Editor value={post.content} onChange={handleContentChange} />
            </div>

            {/* Submit Button */}
            <div className="px-3 flex justify-center">
              <button
                type="submit"
                className="w-full bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition"
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </RequireAuth>
  );
};

export default EditPostPage;
