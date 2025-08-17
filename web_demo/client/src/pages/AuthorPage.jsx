import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AuthorSkeleton from "../components/AuthorSkeleton";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import RequireAuth from "../middleware/RequireAuth";
import fallback from "../assets/fallback.jpg";

export default function AuthorPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleDetailClick = (slug) => {
    navigate(`/detail/${slug}`);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));
      if (token && userData?.uid) {
        try {
          const profileResponse = await axios.get(
            `http://localhost:5000/api/users/${userData.uid}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUser(userData);
          setProfile(profileResponse.data);
          await fetchUserPosts(userData.uid, token);
        } catch (error) {
          toast.error("Không thể tải thông tin tài khoản!");
          console.error("Error fetching profile:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } else {
        setUser(null);
        setProfile(null);
        setPosts([]);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const fetchUserPosts = async (uid, token) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/posts/user/${uid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(response.data.posts);
    } catch (error) {
      toast.error("Không thể tải bài viết của bạn!");
      console.error("Error fetching user posts:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  const truncateDescription = (html, maxLength) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    if (text.length <= maxLength) return html;
    return (
      `${text.substring(0, maxLength)}...` +
      div.innerHTML.substring(0, div.innerHTML.indexOf(">", maxLength))
    );
  };

  if (loading) {
    return <AuthorSkeleton />;
  }

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans text-center p-6">
        <RequireAuth />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-purple-100 py-12 px-6 md:px-20 flex flex-col justify-center md:flex-row items-center gap-10">
        <img
          src={
            profile?.photoUrl ||
            "https://res.cloudinary.com/daeorkmlh/image/upload/v1750775424/avatar-trang-4_jjrbuu.jpg"
          }
          alt="Profile"
          className="w-36 h-36 md:w-48 md:h-48 object-cover rounded-full"
        />
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
            Hey there, I’m {profile?.username || "Anonymous"} <br /> and welcome
            to my Blog
          </h1>
          <p className="text-gray-600 mt-4 max-w-xl">
            {profile?.email || "No email provided"} -{" "}
            {profile?.bio ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
          </p>
          <div className="flex gap-4 mt-4 text-gray-600">
            {profile?.social?.facebook && (
              <a
                href={profile.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400"
              >
                <FaFacebookF />
              </a>
            )}
            {profile?.social?.twitter && (
              <a
                href={profile.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400"
              >
                <FaTwitter />
              </a>
            )}
            {profile?.social?.instagram && (
              <a
                href={profile.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400"
              >
                <FaInstagram />
              </a>
            )}
            {profile?.social?.linkedin && (
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400"
              >
                <FaYoutube />
              </a>
            )}
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Đăng xuất
            </button>
            <Link
              to="/edit-profile"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Chỉnh sửa
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="top-0 left-0 w-full h-[15px] flex justify-center overflow-hidden -translate-y-4">
        <div className="bg-yellow-400 w-2/5 h-full"></div>
        <div className="bg-purple-600 w-60 h-full"></div>
      </div>

      {/* Posts Section */}
      <div className="w-full flex justify-center">
        <section className="px-6 py-12 w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">My Posts</h2>
          <div
            className="space-y-10 mb-8 shadow rounded-2xl cursor-pointer w-full"
            data-aos="fade-up"
          >
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="flex flex-col md:flex-row gap-6 items-center w-full p-4 bg-white 
             border border-gray-200 rounded-2xl shadow-sm 
             hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  onClick={() => handleDetailClick(post.slug)}
                >
                  <img
                    src={post.imageUrl || fallback}
                    alt={post.title}
                    onError={(e) => (e.currentTarget.src = fallback)}
                    className="w-full md:w-1/3 h-48 object-cover rounded-xl"
                  />
                  <div className="flex-1 p-4">
                    <p className="text-purple-600 uppercase font-semibold text-sm">
                      {post.category?.name || "Uncategorized"}
                    </p>
                    <h3 className="text-xl font-bold text-gray-800 mt-1 line-clamp-2">
                      {post.title || "Untitled Post"}
                    </h3>
                    <div className="text-gray-600 mt-2">
                      <h2
                        className="mr-1 w-full overflow-y-auto overflow-x-hidden"
                        dangerouslySetInnerHTML={{
                          __html: truncateDescription(
                            post.description || "",
                            200
                          ),
                        }}
                      ></h2>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {post.tags.map((tagItem) => (
                          <Link
                            key={tagItem._id}
                            to={`/tags/${tagItem.slug}`}
                            className="text-blue-500 text-sm hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            #{tagItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <a
                    href={`/edit-post/${post.slug}`}
                    className="text-blue-700 hover:underline ml-auto p-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-600 p-4">No posts available.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
