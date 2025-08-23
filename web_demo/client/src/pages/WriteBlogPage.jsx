/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RequireAuth from "../middleware/RequireAuth";
import { generateText } from "../services/AiService";
import ImagePostDropzone from "../components/ImagePostDropzone";
import "../style/css/style.css";
import Editor from "../components/Editor";

export default function WriteBlogPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem("blogDraft");
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setTitle(draft.title || "");
      setCategory(draft.category || "");
      setTags(draft.tags || []);
      setDescription(draft.description || "");
      setContent(draft.content || "");
      setPreview(
        draft.imageUrl ||
          "https://res.cloudinary.com/daeorkmlh/image/upload/v1750835215/No-Image-Placeholder.svg_v0th8g.png"
      );
      console.log("priew2" + preview);
    }
  }, [preview]);

  // Handle image preview
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setPreview(
        "https://res.cloudinary.com/daeorkmlh/image/upload/v1750835215/No-Image-Placeholder.svg_v0th8g.png"
      );
    }
  }, [imageFile]);

  // Fetch user info, categories, and tags
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user?.uid) {
      // Fetch user info
      axios
        .get(`http://localhost:5000/api/users/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserName(response.data.username);
        })
        .catch((error) => {
          toast.error("Không thể tải thông tin người dùng!");
          console.error("Error fetching user:", error);
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }
        });

      // Fetch categories
      axios
        .get("http://localhost:5000/api/categories")
        .then((response) => {
          setCategories(response.data.categories);
        })
        .catch((error) => {
          toast.error("Không thể tải danh mục!");
          console.error("Error fetching categories:", error);
        });

      // Fetch latest 10 tags
      axios
        .get("http://localhost:5000/api/tags?limit=10")
        .then((response) => {
          setAvailableTags(response.data.tags);
        })
        .catch((error) => {
          toast.error("Không thể tải tags!");
          console.error("Error fetching tags:", error);
        });
    } else {
      setUserName("");
      navigate("/login");
    }
  }, [navigate]);

  // Handle Editor content
  const handleEditorChange = (html) => {
    setContent(html);
  };

  // Handle AI generation
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Vui lòng nhập gợi ý cho AI.");
      return;
    }
    setIsLoadingAI(true);
    try {
      const result = await generateText(aiPrompt);
      setAiResult(result);
      toast.success("Tạo nội dung AI thành công!");
    } catch (error) {
      toast.error("Lỗi khi tạo nội dung AI.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Handle create new tag
  const handleCreateTag = async () => {
    if (!newTag.trim()) {
      toast.error("Vui lòng nhập tên tag!");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/tags",
        { name: newTag },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAvailableTags((prev) => [...prev, response.data]);
      setTags((prev) => [...prev, response.data._id]);
      setNewTag("");
      toast.success("Tạo tag mới thành công!");
    } catch (error) {
      toast.error("Lỗi khi tạo tag mới!");
      console.error("Error creating tag:", error);
    }
  };

  // Handle save draft
  const handleSaveDraft = () => {
    const draft = {
      category,
      title,
      description,
      content,
      imageUrl: preview,
      tags,
    };
    localStorage.setItem("blogDraft", JSON.stringify(draft));
    toast.success("Lưu bản nháp thành công trên máy!");
  };

  // Handle submit post
  const handleSubmit = async () => {
    const toastId = toast.loading("Đang đăng bài viết...");
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user?.uid) {
      toast.update(toastId, {
        render: "Bạn chưa đăng nhập!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    if (!title || !description || !category || !content) {
      toast.update(toastId, {
        render:
          "Vui lòng nhập đầy đủ tiêu đề, nội dung, mô tả tóm tắt và danh mục!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("uid", user.id);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("content", content);
      formData.append("category", category);
      tags.forEach((tagId) => formData.append("tags", tagId));
      if (imageFile) formData.append("image", imageFile);

      await axios.post("http://localhost:5000/api/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear form
      setTitle("");
      setCategory("");
      setTags([]);
      setDescription("");
      setContent("");
      setImageFile(null);
      setPreview(
        "https://res.cloudinary.com/daeorkmlh/image/upload/v1750835215/No-Image-Placeholder.svg_v0th8g.png"
      );
      localStorage.removeItem("blogDraft");

      toast.update(toastId, {
        render: "Đăng bài thành công!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => navigate(`/author`), 2000);
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: err.response?.data?.error || "Lỗi khi đăng bài viết.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <RequireAuth>
      <div className="w-full">
        <div className="max-w-[70vw] mx-auto" data-aos="fade-up">
          <div className="w-full py-8 flex justify-center">
            <div className="flex-col w-full">
              {/* User Info */}
              <div className="w-full p-4 flex">
                <div className="flex-col">
                  <div className="flex items-center w-full">
                    <img
                      src={
                        userName?.photoUrl ||
                        "https://res.cloudinary.com/daeorkmlh/image/upload/v1750775424/avatar-trang-4_jjrbuu.jpg"
                      }
                      alt="useravatar"
                      className="h-[75px] w-[73px] rounded-full mr-4"
                    />
                    <h3 className="text-purple-700 font-bold text-[28px]">
                      {userName || "Loading..."}
                    </h3>
                  </div>
                  <h2 className="text-[34px] font-bold mt-3">
                    Hey {userName || "there"}, hôm nay bạn muốn đăng gì?
                  </h2>
                </div>
              </div>

              {/* Title */}
              <div className="p-3">
                <h3 className="font-bold text-[26px] sm:text-2xl mt-3">
                  Tiêu đề
                </h3>
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Viết tiêu đề tại đây"
                  className="mt-2 text-[26px] w-full border-3 border-gray-200 p-3 h-35 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Category */}
              <div className="p-3">
                <h3 className="font-bold text-[22px] sm:text-2xl mb-2">
                  Danh mục
                </h3>
                <div className="flex flex-wrap justify-center sm:justify-start gap-6 p-4">
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      onClick={() => setCategory(cat._id)}
                      className={`cursor-pointer flex items-center gap-3 px-4 py-2 border-2 rounded-xl transition-all ${
                        category === cat._id
                          ? "bg-yellow-400 border-gray-500"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100">
                        <span className="text-sm font-medium">
                          {cat.name[0]}
                        </span>
                      </div>
                      <h2 className="font-medium text-base sm:text-lg">
                        {cat.name}
                      </h2>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="p-3">
                <h3 className="font-bold text-[26px] sm:text-2xl">Tags</h3>
                <div className="p-3 sm:p-4 md:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 justify-start">
                    {availableTags.map((tag) => (
                      <div
                        key={tag._id}
                        onClick={() =>
                          setTags((prev) =>
                            prev.includes(tag._id)
                              ? prev.filter((t) => t !== tag._id)
                              : [...prev, tag._id]
                          )
                        }
                        className={`hoverBehavior activeBehavior flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-colors ${
                          tags.includes(tag._id)
                            ? "bg-yellow-400 border-gray-500"
                            : "border-gray-200"
                        }`}
                      >
                        <h2 className="font-bold text-[18px]">#{tag.name}</h2>
                      </div>
                    ))}
                    <div className="hoverBehavior activeBehavior flex items-center justify-between p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-300">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Thêm tag mới"
                        className="w-full p-1 text-sm border-none focus:outline-none"
                      />
                      <button
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
              <div className="p-3 mb-4">
                <label className="block font-bold text-[24px]">Hình ảnh</label>
                <ImagePostDropzone
                  setAvatarFile={setImageFile}
                  setPreview={setPreview}
                  setAvatarError={setImageError}
                />
                {preview && (
                  <div className="mt-2 flex items-center gap-4 ">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 object-cover rounded w-60 h-60"
                    />
                  </div>
                )}
                {imageError && (
                  <p className="text-red-500 text-sm mt-1">{imageError}</p>
                )}
              </div>

              {/* Description */}
              <div className="p-3">
                <h3 className="font-bold text-[26px] mt-4">Tóm tắt nội dung</h3>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Viết nội dung tóm tắt tại đây"
                  className="mt-2 text-[20px] w-full border-3 border-gray-200 p-3 h-35 border border-gray-300 rounded-lg"
                />
              </div>

              {/* AI Generation */}
              <div className="p-3">
                <h3 className="font-bold text-[26px] mt-4">
                  Tạo nội dung bằng AI
                </h3>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Nhập gợi ý cho AI..."
                  className="mt-2 w-full p-3 border rounded border-gray-300"
                />
                <button
                  onClick={handleAiGenerate}
                  disabled={isLoadingAI}
                  className="mt-2 w-44 bg-blue-600 text-white font-bold text-[18px] p-3 rounded hover:bg-blue-700 transition"
                >
                  {isLoadingAI ? "Đang tạo…" : "Tạo nội dung"}
                </button>
              </div>

              {/* AI Result Preview */}
              {aiResult && (
                <div className="p-3 mt-3">
                  <h3 className="font-bold text-[22px]">Kết quả AI:</h3>
                  <div className="mt-2 p-3 border rounded border-gray-300 bg-gray-100">
                    {aiResult}
                  </div>
                  <button
                    onClick={() => setContent(aiResult)}
                    className="mt-2 w-auto bg-green-600 text-white font-bold text-[18px] p-3 rounded hover:bg-green-700 transition"
                  >
                    Sử dụng trong Editor
                  </button>
                </div>
              )}

              {/* Editor */}
              <div className="p-3">
                <h3 className="font-bold text-[26px] mt-4">Nội dung</h3>
                <Editor value={content} onChange={handleEditorChange} />
              </div>

              {/* Buttons */}
              <div className="p-3 flex justify-center">
                <button
                  onClick={handleSaveDraft}
                  className="w-44 savebutton text-black font-bold text-[20px] p-3 mt-4 transition duration-300"
                >
                  Lưu bản nháp
                </button>
                <button
                  onClick={handleSubmit}
                  className="ml-3 w-44 publishbutton text-black font-bold text-[20px] p-3 mt-4 transition duration-300"
                >
                  Đăng bài viết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
