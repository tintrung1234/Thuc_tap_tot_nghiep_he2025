/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RequireAuth from "../middleware/RequireAuth";
import { generateText } from "../services/AiService";
import ImagePostDropzone from "../components/ImagePostDropzone";
import "../style/css/style.css";
import UserAva from "../assets/UserAva.jpg";
import shuttle from "../assets/shuttle.png";
import business from "../assets/business.png";
import economy from "../assets/economy.png";
import cyborg from "../assets/cyborg.png";
import Editor from "../components/Editor";

export default function WriteBlogPage() {
  const navigate = useNavigate();
  const categories = ["Startup", "Business", "Economy", "Technology"];
  const tagsName = [
    "Experience",
    "Screen",
    "Marketing",
    "Life",
    "Technology",
    "Business",
  ];
  const image = [shuttle, business, economy, cyborg];

  const [userName, setUserName] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [title, setTitle] = useState("");
  const [categorys, setCategorys] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [preview, setPreview] = useState("");

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem("blogDraft");
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setTitle(draft.title || "");
      setCategorys(draft.categorys || "");
      setTags(draft.tags || []);
      setDescription(draft.description || "");
      setPreview(
        draft.imageUrl ||
          "https://res.cloudinary.com/daeorkmlh/image/upload/v1750835215/No-Image-Placeholder.svg_v0th8g.png"
      );
    }
  }, []);

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

  // Fetch user info from localStorage and API
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user?.uid) {
      axios
        .get(`http://localhost:5000/api/users/profile/${user.uid}`, {
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
    } else {
      setUserName("");
    }
  }, [navigate]);

  // Handle Editor content
  const handleEditorChange = (html) => {
    setDescription(html);
  };

  // Handle AI generation
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Enter a prompt for AI generation.");
      return;
    }
    setIsLoadingAI(true);
    try {
      const result = await generateText(aiPrompt);
      setAiResult(result);
      toast.success("AI generation successful!");
    } catch (error) {
      toast.error("Error generating AI text.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Handle save draft
  const handleSaveDraft = () => {
    const draft = {
      categorys,
      title,
      description,
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

    try {
      const formData = new FormData();
      formData.append("uid", user.uid);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", categorys);
      tags.forEach((tag) => formData.append("tags", tag));
      if (imageFile) formData.append("image", imageFile);

      await axios.post("http://localhost:5000/api/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear form
      setTitle("");
      setCategorys("");
      setTags([]);
      setDescription("");
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
              <div className="w-full p-4 flex justify-center">
                <div className="flex-col">
                  <div className="flex items-center w-full">
                    <img
                      src={UserAva}
                      alt="useravatar"
                      className="h-[75px] w-[73px] rounded-full mr-4"
                    />
                    <h3 className="text-purple-700 font-bold text-[28px]">
                      {userName || "Loading..."}
                    </h3>
                  </div>
                  <h2 className="text-[38px] font-bold mt-3">
                    Hey {userName || "there"}, what do you want to post today?
                  </h2>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-bold text-[26px] sm:text-2xl mt-3">
                  Title
                </h3>
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Write here"
                  className="mt-2 text-[26px] w-full border-3 border-gray-200 p-3 h-40 border border-gray-300"
                />
              </div>

              {/* Category */}
              <div className="p-3">
                <h3 className="font-bold text-[22px] sm:text-2xl mb-2">
                  Category
                </h3>
                <div className="flex flex-wrap justify-center sm:justify-start gap-6 p-4">
                  {categories.map((cat, index) => (
                    <div
                      key={index}
                      onClick={() => setCategorys(cat)}
                      className={`cursor-pointer flex items-center gap-3 px-4 py-2 border-2 rounded-xl transition-all ${
                        categorys === cat
                          ? "bg-yellow-400 border-gray-500"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100">
                        <img
                          src={image[index]}
                          alt={cat}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <h2 className="font-medium text-base sm:text-lg">
                        {cat}
                      </h2>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="p-3">
                <h3 className="font-bold text-[26px] sm:text-2xl">Tags</h3>
                <div className="p-3 sm:p-4 md:p-6 justify-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 justify-start">
                      {tagsName.map((tag, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            setTags((prev) =>
                              prev.includes(tag)
                                ? prev.filter((t) => t !== tag)
                                : [...prev, tag]
                            )
                          }
                          className={`cursor-pointer transition-all h-14 sm:h-16 flex items-center justify-center p-3 mt-2 border-2 border-gray-200 rounded-2xl sm:rounded-[2vw] mr-2 sm:mr-3 ${
                            tags.includes(tag)
                              ? "bg-yellow-400 border-gray-500"
                              : "border-gray-200"
                          }`}
                        >
                          <h2 className="font-bold text-sm sm:text-lg md:text-[20px]">
                            {tag}
                          </h2>
                        </div>
                      ))}
                      <div className="hoverBehavior h-14 sm:h-16 flex items-center justify-center p-3 mt-2 border-2 border-gray-200 rounded-2xl sm:rounded-[2vw] mr-2 sm:mr-3">
                        <h2 className="font-bold text-xl sm:text-2xl md:text-[30px]">
                          +
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="p-3">
                <label className="block font-semibold text-[24px]">Image</label>
                <ImagePostDropzone
                  setAvatarFile={setImageFile}
                  setPreview={setPreview}
                  setAvatarError={setImageError}
                />
                {preview && (
                  <div className="mt-8 flex items-center gap-4 w-60 h-60">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 object-cover rounded"
                    />
                  </div>
                )}
                {imageError && (
                  <p className="text-red-500 text-sm mt-2">{imageError}</p>
                )}
              </div>

              {/* AI Generation */}
              <div className="p-3">
                <h3 className="font-bold text-[26px] mt-4">
                  Get AI Generated Text
                </h3>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Enter your prompt..."
                  className="mt-2 w-full p-3 border rounded border-gray-300"
                />
                <button
                  onClick={handleAiGenerate}
                  disabled={isLoadingAI}
                  className="mt-2 w-44 bg-blue-600 text-white font-bold text-[18px] p-3 rounded hover:bg-blue-700 transition"
                >
                  {isLoadingAI ? "Generating…" : "Generate"}
                </button>
              </div>

              {/* AI Result Preview */}
              {aiResult && (
                <div className="p-3 mt-3">
                  <h3 className="font-bold text-[22px]">AI Result:</h3>
                  <div className="mt-2 p-3 border rounded border-gray-300 bg-gray-100">
                    {aiResult}
                  </div>
                  <button
                    onClick={() => setDescription(aiResult)}
                    className="mt-2 w-44 bg-green-600 text-white font-bold text-[18px] p-3 rounded hover:bg-green-700 transition"
                  >
                    Use in Editor
                  </button>
                </div>
              )}

              {/* Editor */}
              <div className="p-3">
                <h3 className="font-bold text-[26px] mt-4">Body</h3>
                <Editor value={description} onChange={handleEditorChange} />
              </div>

              {/* Buttons */}
              <div className="p-3 flex justify-center">
                <button
                  onClick={handleSaveDraft}
                  className="w-44 savebutton text-black font-bold text-[20px] p-3 mt-4 transition duration-300"
                >
                  Save Draft
                </button>
                <button
                  onClick={handleSubmit}
                  className="ml-3 w-44 publishbutton text-black font-bold text-[20px] p-3 mt-4 transition duration-300"
                >
                  Publish Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
