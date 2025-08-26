import React, { useState } from "react";
import { privateApi } from "../api/axios";
import { toast } from "react-toastify";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    queryRelated: "",
    message: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Bạn chưa đăng nhập");
    }
    e.preventDefault();
    try {
      const response = await privateApi.post("/api/contact", formData);
      setStatus({ type: "success", message: response.data.message });
      setFormData({ fullName: "", email: "", queryRelated: "", message: "" });
      toast.success("Gửi liên hệ thành công!");
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
      toast.error("Không thể gửi liên hệ. Vui lòng thử lại sau!");
      console.error("Error submit contact:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 " data-aos="fade-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Let's Start a Conversation
        </h1>
        <p className="text-gray-600 mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim.
        </p>
      </div>
      <div className="bg-purple-800 text-gray-300 p-6 mb-6 flex justify-around">
        <div>
          <p>Working hours</p>
          <hr className="border-t border-gray-300 mb-4 mt-4" />
          <p className="font-bold text-white">Monday To Friday</p>
          <p className="font-bold text-white">9:00 AM to 8:00 PM</p>
          <p>Our Support Team is available 24/7</p>
        </div>
        <div className="">
          <p>Contact Us</p>
          <hr className="border-t border-gray-300 mb-4 mt-4" />
          <p className="font-bold text-white">012 3456 789</p>
          <p>vfriends@gmail.com</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full p-3 border rounded"
          required
        />
        <select
          name="queryRelated"
          value={formData.queryRelated}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        >
          <option value="" disabled>
            Query Related
          </option>
          <option name="support" value="support">
            Support
          </option>
          <option name="feedback" value="feedback">
            Feedback
          </option>
          <option name="inquiry" value="inquiry">
            Inquiry
          </option>
          <option name="complaint" value="complaint">
            Complaint
          </option>
          <option name="other" value="other">
            Other
          </option>
        </select>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message"
          className="w-full p-3 border rounded h-32"
          required
        />
        <button
          type="submit"
          className="w-full bg-yellow-400 text-black p-3 rounded hover:bg-yellow-500"
        >
          Send Message
        </button>
      </form>
      {status && (
        <p
          className={`mt-4 ${
            status.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
};

export default ContactPage;
