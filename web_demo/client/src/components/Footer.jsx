import React from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPhone,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white px-6 py-8">
      {/* Top Left - VFriends Logo */}
      <div className="mb-6">
        <div className="text-2xl font-bold">VFriends</div>
      </div>

      {/* Centered Sections - Liên hệ, Danh mục, Khám phá thêm */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-4xl mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">KHÁM PHÁ THÊM</h3>
          <a href="login" className="block text-gray-400 hover:text-white mb-2">
            Đăng nhập
          </a>
          <a
            href="register"
            className="block text-gray-400 hover:text-white mb-2"
          >
            Tạo tài khoản
          </a>
          <a
            href="/author"
            className="block text-gray-400 hover:text-white mb-2"
          >
            Hồ sơ cá nhân
          </a>
          <a
            href="/privacy"
            className="block text-gray-400 hover:text-white mb-2"
          >
            Chính sách bảo mật
          </a>
          <a
            href="terms-of-service"
            className="block text-gray-400 hover:text-white"
          >
            Điều khoản dịch vụ
          </a>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">DANH MỤC</h3>
          <a
            href="/category/Startup"
            className="block text-gray-400 hover:text-white mb-2"
          >
            Startup
          </a>
          <a
            href="/category/Business"
            className="block text-gray-400 hover:text-white mb-2"
          >
            Business
          </a>
          <a
            href="/category/Economic"
            className="block text-gray-400 hover:text-white mb-2"
          >
            Economic
          </a>
          <a
            href="/category/Technology"
            className="block text-gray-400 hover:text-white mb-2"
          >
            Technology
          </a>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">LIÊN HỆ</h3>
          <p className="text-gray-400 flex items-center space-x-3 mb-4">
            <FaEnvelope className="text-blue-400" />
            <span>vfriends@gmail.com</span>
          </p>
          <p className="text-gray-400 flex items-center space-x-3 mb-4">
            <FaMapMarkerAlt className="text-blue-400" />
            <span>55/5a Nguyễn Hữu Cầu, Hóc Môn, Hồ Chí Minh</span>
          </p>
          <p className="text-gray-400 flex items-center space-x-3 mb-4">
            <FaPhone className="text-blue-400" />
            <span>012 3456 789</span>
          </p>
        </div>
      </div>

      {/* Bottom Row - Copyright and Social Media */}
      <div className="flex justify-between items-center">
        <div className="text-gray-400">
          <span>@Copy right 2025</span>
        </div>
        <div className="flex justify-end space-x-6">
          <a href="#" className="text-gray-400 hover:text-blue-400">
            <FaFacebookF />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400">
            <FaTwitter />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400">
            <FaInstagram />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400">
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
