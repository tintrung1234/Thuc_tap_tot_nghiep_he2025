import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import TopPostSkeleton from "../components/TopPostSkeleton";
import BlogSkeleton from "../components/BlogSkeleton";
import JoinSection from "../components/JoinSection";
import CategoryList from "../components/CategoryList";
import AuthorsList from "../components/AuthorsList";
import AI_image from "../assets/AI_robot.png";
import bannerImg from "../assets/banner.png";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [topPost, setTopPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch recent posts
  useEffect(() => {
    const getRecentPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/recent`
        );
        setPosts(response.data);
      } catch (error) {
        toast.error("Không thể tải dữ liệu bài biết mới nhất!");
        console.error("Error fetching recent posts:", error);
      } finally {
        setLoading(false);
      }
    };
    getRecentPosts();
  }, []);

  // Fetch featured posts
  useEffect(() => {
    const getFeaturedPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/featured`
        );
        setFeaturedPosts(response.data);
      } catch (error) {
        toast.error("Không thể tải dữ liệu bài nổi bật!");
        console.error("Error fetching featured posts:", error);
      } finally {
        setLoading(false);
      }
    };
    getFeaturedPosts();
  }, []);

  // Fetch top post
  useEffect(() => {
    const getTopPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/top`);
        setTopPost(response.data);
      } catch (error) {
        toast.error("Không thể tải dữ liệu bài biết top 1!");
        console.error("Error fetching top blog:", error);
      } finally {
        setLoading(false);
      }
    };
    getTopPost();
  }, []);

  const handleDetailClick = (_id) => {
    navigate(`/detail/${encodeURIComponent(_id)}`);
  };

  const handleClick = () => {
    navigate(`/write-blog`);
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
    return (
      <div className="max-w-[80vw] mx-auto px-6 py-8">
        <TopPostSkeleton />
        <BlogSkeleton count={5} />
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <div
        className="bg-[url(./assets/banner_1.jpg)] bg-cover bg-center bg-no-repeat w-full h-screen text-white mb-12 pt-[10vh] pb-[10vh] pl-[5vw]"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
      >
        <div className="flex">
          <h2 className="mr-1">POSTED ON</h2>
          <h2 className="mr-1 font-bold">{topPost?.category.name || ""}</h2>
        </div>

        <h1 className="font-bold w-[60vw] text-[3vw] mb-3">
          {topPost?.title || ""}
        </h1>

        <div className="flex text-lg mb-3">
          <h2 className="mr-1">BY</h2>
          <h2 className="mr-1 font-bold text-yellow-500">
            <span>{topPost?.uid?.username || "Tác giả không xác định"}</span>
          </h2>
          <h2 className="mr-1">
            {" "}
            | {new Date(topPost?.createdAt).toLocaleDateString("vi-VN")}
          </h2>
        </div>
        <h2
          className="mr-1 w-[60vw] overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html: truncateDescription(topPost?.description || "", 200) || "",
          }}
        ></h2>

        <button
          className="text-black bg-yellow-500 hover:bg-yellow-600 px-4 py-2 font-bold mt-10"
          onClick={() => {
            handleDetailClick(topPost.slug);
          }}
        >
          READ MORE {">"}
        </button>
      </div>

      <div className="max-w-[80vw] mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Featured Posts */}
          <div
            className="md:col-span-2 mb-5"
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
          >
            <h2 className="text-2xl font-bold mb-5">Bài viết nổi bật</h2>

            {featuredPosts && featuredPosts.length > 0 ? (
              featuredPosts.map((post) => (
                <div key={post._id} className="border p-4 mb-4">
                  <img
                    src={post.imageUrl}
                    alt="Featured Post"
                    className="w-full h-60 mb-4"
                  />
                  <div className="text-sm text-gray-600 mb-1">
                    By{" "}
                    <span className="text-indigo-600 font-medium">
                      {post?.uid?.username || "Tác giả không xác định"}
                    </span>{" "}
                    | {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{post?.title}</h3>
                  <h2
                    className="mr-1 w-full overflow-y-auto mt-2 mb-4"
                    dangerouslySetInnerHTML={{
                      __html:
                        truncateDescription(post?.description || "", 200) || "",
                    }}
                  ></h2>
                  <button
                    className="bg-yellow-300 text-black px-4 py-2 font-semibold hover:bg-yellow-400"
                    onClick={() => {
                      handleDetailClick(post.slug);
                    }}
                  >
                    Xem thêm {">"}
                  </button>
                </div>
              ))
            ) : (
              <p>Không có bài viết nổi bật</p>
            )}
          </div>

          {/* Recent Posts */}
          <div
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Bài viết mới nhất
              </h2>
              <a
                href="/blog"
                className="text-purple-600 text-sm hover:underline transition duration-200"
              >
                Xem tất cả {">"}
              </a>
            </div>
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="p-4 rounded-lg shadow-md bg-white hover:shadow-lg hover:scale-[1.01] transition cursor-pointer border-l-4 border-yellow-200"
                  onClick={() => {
                    handleDetailClick(post.slug);
                  }}
                >
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span className="mr-1"> By </span>
                    <span className="text-indigo-600 font-medium">
                      {post?.uid?.username || "Tác giả không xác định"}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 line-clamp-2">
                    {post?.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="max-w-[80vw] mx-auto flex flex-col md:flex-row items-center p-3 space-x-0 md:space-x-4 space-y-2 md:space-y-0"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <div className="w-42 h-42 flex-shrink-0 rounded-full flex items-center bg-teal-100">
            <img src={AI_image} alt="chatbot icon" className="w-22 h-22" />
          </div>
          <div className="flex flex-col justify-center space-y-3">
            <h2 className="text-2xl font-bold">
              Generate Blogs Smarter with AI
            </h2>
            <p className="text-gray-600">
              Struggling with writer’s block? Short on time? Our built-in AI
              writing assistant helps you turn ideas into fully-formed blog
              posts in just a few clicks.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 font-bold">
              <li>Just enter a topic or keywords</li>
              <li>Instantly get blog titles, outlines, and full content</li>
              <li>Fully editable and SEO-ready</li>
            </ul>
            <p className="text-gray-500">
              💡 Try it now — your next great blog post is just one prompt away!
            </p>
          </div>
        </div>

        {/* Category */}
        <CategoryList
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        />

        <div
          className="flex flex-col md:flex-row bg-white rounded-md overflow-hidden mt-14 relative mb-14"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <div className="w-full">
            {/* Image */}
            <div className="w-[60vw] h-full">
              <img
                src={bannerImg}
                alt="Why we started"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Content */}
            <div className="w-full h-[2vh] mb-3 justify-end items-end flex absolute">
              <div className="p-8 py-20 flex flex-col justify-center bg-white w-[40vw]">
                <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                  Why we started
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 leading-snug">
                  It started out as a simple idea and evolved into our passion
                </h2>
                <p className="text-gray-600 mb-6 w-[36vw]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip.
                </p>
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 transition px-5 py-2 text-black font-semibold w-fit"
                  onClick={() => {
                    handleClick();
                  }}
                >
                  Khám phá {">"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Authors List Section */}
        <AuthorsList
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-easing="ease-in-out"
        />

        <JoinSection
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-easing="ease-in-out"
        />

        <div
          className="relative bg-[#F5F3FF] px-8 py-12 md:px-16 md:py-16 my-20"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-easing="ease-in-out"
        >
          {/* Top border color bar */}
          <div className="absolute top-0 left-0 w-full h-[15px] flex justify-end -translate-y-[15px]">
            <div className="bg-yellow-400 w-1/2 h-full"></div>
            <div className="bg-purple-600 w-60 h-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 z-10 relative">
            {/* Left Column */}
            <div>
              <h4 className="text-sm uppercase text-gray-500 mb-2">
                Về chúng tôi
              </h4>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                Chúng tôi là một cộng đồng những người viết nội dung chia sẻ
                những kiến thức của họ
              </h2>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <a
                href="about-us"
                className="text-purple-600 font-semibold hover:underline"
              >
                Xem thêm {">"}
              </a>
            </div>

            {/* Right Column */}
            <div>
              <h4 className="text-sm uppercase text-gray-500 mb-2">Sứ mệnh</h4>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                Tạo nội dung có giá trị cho những người sáng tạo trên toàn thế
                giới
              </h2>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
