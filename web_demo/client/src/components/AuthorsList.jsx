import React, { useEffect, useState } from "react";
import { publicApi } from "../api/axios";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const AuthorsList = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    facebook: FaFacebook,
    twitter: FaTwitter,
    instagram: FaInstagram,
    linkedin: FaLinkedin,
  };

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await publicApi.get("/users/recent");
        setAuthors(response.data);
      } catch (error) {
        toast.error("Không thể tải danh sách tác giả. Vui lòng thử lại sau!");
        console.error("Failed to load authors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <div className="mb-12" data-aos="zoom-in">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        List of Authors
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 ">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 p-4 rounded-lg animate-pulse">
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-300 mb-4" />
              <div className="h-4 bg-gray-300 w-2/3 mx-auto mb-2" />
              <div className="h-3 bg-gray-200 w-1/2 mx-auto mb-3" />
              <div className="flex justify-center gap-2">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="w-5 h-5 bg-gray-200 rounded-full"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {authors.map((author, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg text-center shadow hover:shadow-md transition duration-300"
            >
              <img
                src={
                  author.photoUrl ||
                  "https://res.cloudinary.com/daeorkmlh/image/upload/v1750775424/avatar-trang-4_jjrbuu.jpg"
                }
                alt={author.username}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {author.username}
              </h3>
              <p className="text-sm text-gray-600 mb-2">Content Writer</p>
              <div className="flex justify-center gap-3 mt-2">
                {author.social &&
                  Object.entries(author.social).map(([platform, url]) => {
                    const Icon = iconMap[platform];
                    return (
                      Icon && (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <Icon size={18} />
                        </a>
                      )
                    );
                  })}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AuthorsList;
