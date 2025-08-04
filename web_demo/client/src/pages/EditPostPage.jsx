import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "quill/dist/quill.snow.css"; // Import Quill's CSS
import axios from "axios";
import { toast } from "react-toastify";
import Editor from "../components/Editor";
import { getAuth } from "firebase/auth";
import UserAva from "../assets/UserAva.jpg";
import shuttle from "../assets/shuttle.png";
import business from "../assets/business.png";
import economy from "../assets/economy.png";
import cyborg from "../assets/cyborg.png";
import { onAuthStateChanged } from "firebase/auth";
import EditPostPageSkeleton from "../components/EditPostPageSkeleton";
import ImagePostDropzone from "../components/ImagePostDropzone";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const [post, setPost] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    tags: [],
  });
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Sample categories and images
  const categories = ["Startup", "Business", "Economy", "Technology"];
  const images = [shuttle, business, economy, cyborg];

  // Sample tags
  const tagsName = [
    "Life",
    "Technology",
    "Business",
    "Marketing",
    "Starup",
    "Experience",
    "Screen",
  ];

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarError, setAvatarError] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/detail/${id}`
        );
        const data = response.data;
        setPost({
          title: data.title || "",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          category: data.category || "",
          tags: data.tags || [],
        });
        setPreview(
          data.imageUrl ||
            "https://res.cloudinary.com/daeorkmlh/image/upload/v1750835215/No-Image-Placeholder.svg_v0th8g.png"
        );
      } catch (error) {
        toast.error("Không thể tải bài viết!");
        console.error("Error fetching post:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const profileResponse = await axios.get(
            `http://localhost:5000/api/users/profile/${currentUser.uid}`
          );
          setProfile(profileResponse.data);
        } catch (error) {
          toast.error("Không thể tải thông tin tài khoản!");
          console.error("Error fetching profile:", error);
        }
      } else {
        setProfile(null);
      }
      await fetchPost(); // Fetch post after profile is handled
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleEditorChange = (html) => {
    setPost((prevPost) => ({
      ...prevPost,
      description: html,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Bạn chưa đăng nhập");

      const token = await user.getIdToken();

      const data = new FormData();
      data.append("category", post.category);
      data.append("title", post.title);
      data.append("description", post.description);
      if (avatarFile) {
        data.append("image", avatarFile);
      }
      post.tags.forEach((tag) => data.append("tags", tag));

      await axios.put(`http://localhost:5000/api/posts/update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Cập nhật bài viết thành công!");
      setTimeout(() => navigate(`/author`), 1000);
    } catch (error) {
      toast.error("Cập nhật bài viết thất bại!");
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <EditPostPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div data-aos="fade-up">
        {/* User Info */}
        <div className="w-full py-8 flex justify-center">
          <div className="max-w-4xl p-4 flex justify-center">
            <div className="flex-col">
              <div className="flex items-center w-full">
                <img
                  src={profile?.photoUrl || UserAva}
                  alt="useravatar"
                  className="h-[75px] w-[73px] rounded-full mr-4"
                />
                <h3 className="text-purple-700 font-bold text-[28px]">
                  {profile?.username || "Anonymous"}
                </h3>
              </div>
              <h2 className="text-[34px] font-bold mt-3">
                Hey {profile?.username || "Anonymous"}, What would you like to
                edit about this blog?
              </h2>
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-8"
        >
          <div>
            <label className="block font-semibold text-[24px]">Title</label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <h3 className="block font-semibold text-[24px]">Category</h3>
            <div className="p-4 flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  onClick={() => setPost({ ...post, category: cat })}
                  className={`hoverBehavior w-full sm:w-80 h-33 flex items-center p-3 mt-2 border-2 rounded-xl cursor-pointer transition-colors ${
                    post.category === cat
                      ? "bg-yellow-400 border-yellow-500"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="colorSmallBox w-15 h-15 justify-center items-center flex rounded-xl">
                    <img
                      src={images[index]}
                      alt="category"
                      className="w-[25px] h-[25px]"
                    />
                  </div>
                  <h2 className="font-semibold text-[18px] ml-3">{cat}</h2>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="block font-semibold text-[24px]">Tags</h3>
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {tagsName.map((tag, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      setPost((prevPost) => {
                        const newTags = prevPost.tags.includes(tag)
                          ? prevPost.tags.filter((t) => t !== tag)
                          : [...prevPost.tags, tag];
                        return { ...prevPost, tags: newTags };
                      })
                    }
                    className={`hoverBehavior activeBehavior flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-colors ${
                      post.tags.includes(tag)
                        ? "bg-yellow-400 border-yellow-500"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <h2 className="font-bold text-[18px]">#{tag}</h2>
                  </div>
                ))}

                {/* Add tag button */}
                <div className="hoverBehavior activeBehavior flex items-center justify-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-300">
                  <h2 className="font-bold text-[18px]">+</h2>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[24px]">Image</label>
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
                  className="mt-2 object-cover rounded"
                />
              </div>
            )}

            {avatarError && (
              <p className="text-red-500 text-sm mt-1">{avatarError}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold text-[24px] ">Body</label>
            <Editor value={post.description} onChange={handleEditorChange} />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;
