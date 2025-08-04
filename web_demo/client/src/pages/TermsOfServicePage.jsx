import React, { useState, useEffect } from "react";
import axios from "axios";
import TermsSection from "../components/TermsSection";
import TermsSkeletonCard from "../components/TermsSkeletonCard";
import { toast } from "react-toastify";

const TermsOfServicePage = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestUpdate, setLatestUpdate] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/terms");
        setTerms(response.data.terms || []);
        setLatestUpdate(response.data.latestUpdate);
      } catch (error) {
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau!");
        console.error("Failed to load terms of service:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formattedDate =
    latestUpdate &&
    new Date(latestUpdate).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8" data-aos="fade-up">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Điều Khoản Dịch Vụ
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        {formattedDate && `Cập nhật lần cuối: ${formattedDate}`}
      </p>
      <hr className="border-t border-gray-300 mb-6" />

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <TermsSkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in duration-700">
          {Array.isArray(terms) && terms.length > 0 ? (
            terms.map((section) => (
              <TermsSection key={section._id} section={section} />
            ))
          ) : (
            <p className="text-center text-gray-500">
              Không thể tải dữ liệu. Vui lòng thử lại sau!
            </p>
          )}
          <div className="text-center mt-8">
            <button
              onClick={scrollToTop}
              className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
            >
              Back to top
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsOfServicePage;
