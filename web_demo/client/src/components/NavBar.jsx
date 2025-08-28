import { useState, useRef, useEffect } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { publicApi } from "../api/axios";

const NavBar = () => {
  const [showInput, setShowInput] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [categories, setCategories] = useState([]);

  //Tự động mở bàn phím khi mở search box
  useEffect(() => {
    if (showInput && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showInput]);

  const handleToggleSearch = () => {
    setShowInput(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      console.log("Tìm kiếm:", searchValue);
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
      e.target.value = ""; // Clear the input field
    }
  };

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowInput(false);
        setSearchValue(""); // Clear search value when closing
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await publicApi.get("/categories?page=1&limit=10");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug) => {
    navigate(`/category/${encodeURIComponent(categorySlug)}`);
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Icon */}
        <button className="md:hidden text-2xl" onClick={handleToggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Logo */}
        <div className="text-2xl font-bold mx-auto md:mx-0 cursor-pointer">
          <a href="/">VFriends</a>
        </div>

        {/* Menu Links (Desktop) */}
        <div className="hidden md:flex justify-center mt-0 space-x-6">
          <a
            href="/"
            className="hover:text-gray-300 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gray-300 after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full"
          >
            TRANG CHỦ
          </a>
          <a
            href="/blog"
            className="hover:text-gray-300 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gray-300 after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full"
          >
            BLOG
          </a>
          <div className="relative group ">
            {/* Nút chính */}
            <button className="hover:text-gray-300 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gray-300 after:transition-all after:duration-300 group-hover:after:left-0 group-hover:after:w-full">
              DANH MỤC
            </button>

            {/* Dropdown menu */}
            <div className="absolute left-0 top-full w-32 bg-white border rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {cat.name}
                  </button>
                ))
              ) : (
                <p className="px-4 py-2 text-gray-500">Đang tải...</p>
              )}
            </div>
          </div>
          <a
            href="/about-us"
            className="hover:text-gray-300 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gray-300 after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full"
          >
            GIỚI THIỆU
          </a>
          <a
            href="/contact"
            className="hover:text-gray-300 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gray-300 after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full"
          >
            LIÊN HỆ
          </a>
          <a
            href="/author"
            className="hover:text-gray-300 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gray-300 after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full"
          >
            TÀI KHOẢN
          </a>
        </div>

        {/* Search + Post button (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <div ref={wrapperRef} className="relative">
            <div
              className={`
                flex items-center bg-white text-black rounded overflow-hidden
                transition-all duration-500 ease-in-out
                ${
                  showInput
                    ? "w-64 opacity-100 animate-slide-in"
                    : "w-0 opacity-0"
                }
              `}
              style={{ minHeight: "2.5rem" }}
            >
              <span className="px-3 text-gray-600">
                <FaSearch />
              </span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm kiếm..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full py-1 pr-3 outline-none bg-white"
                autoFocus={showInput}
              />
            </div>
            {!showInput && (
              <button
                onClick={handleToggleSearch}
                className="text-xl text-white absolute top-1/2 -translate-y-1/2 right-0"
              >
                <FaSearch />
              </button>
            )}
          </div>

          {/* Đăng bài */}
          <a href="/write-blog">
            <button className="bg-white text-black px-4 py-2 rounded">
              Đăng bài
            </button>
          </a>
        </div>
      </div>

      {/* Menu (Mobile) */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col items-start space-y-3 animate-slide-down">
          <a
            href="/"
            className="hover:text-gray-300 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gray-300 after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full"
          >
            TRANG CHỦ
          </a>
          <a
            href="/blog"
            className="hover:text-gray-300 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gray-300 after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full"
          >
            BLOG
          </a>
          <div className="relative group ">
            {/* Nút chính */}
            <button className="hover:text-gray-300 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gray-300 after:transition-all after:duration-300 group-hover:after:left-0 group-hover:after:w-full">
              DANH MỤC
            </button>

            {/* Dropdown menu */}
            <div className="absolute left-0 top-full w-32 bg-white border rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {cat.name}
                  </button>
                ))
              ) : (
                <p className="px-4 py-2 text-gray-500">Đang tải...</p>
              )}
            </div>
          </div>
          <a
            href="/about-us"
            className="hover:text-gray-300 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gray-300 after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full"
          >
            GIỚI THIỆU
          </a>
          <a
            href="/contact"
            className="hover:text-gray-300 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gray-300 after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full"
          >
            LIÊN HỆ
          </a>
          <a
            href="/author"
            className="hover:text-gray-300 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gray-300 after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full"
          >
            TÀI KHOẢN
          </a>
          <a href="/write-blog">
            <button className="bg-white text-black px-4 py-2 rounded">
              Đăng bài
            </button>
          </a>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
