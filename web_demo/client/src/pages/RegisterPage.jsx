import banner from "../assets/banner_register.png";
import "../style/css/style.css";
import ic_register from "../assets/ic_register.png";
import ic_google from "../assets/ic_google.png";
import ic_fb from "../assets/ic_facebook.png";
import ic_ig from "../assets/ic_ig.png";
import ic_x from "../assets/ic_x.png";
import view from "../assets/view.png";
import hide from "../assets/hide.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          email,
          username,
          password,
        }
      );

      const { token, user } = response.data;

      // Lưu token vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess("Tạo tài khoản thành công!");
      toast.success("Tạo tài khoản thành công!");

      // Delay 2 giây trước khi chuyển hướng
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error("Tạo tài khoản thất bại!");
      const errorMessage =
        err.response?.data?.error || "Đã xảy ra lỗi khi đăng ký.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white my-10">
      <div className="flex max-w-5xl w-full shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full md:w-3/5 register-bg p-10 space-y-6">
          <div className="flex flex-col items-center">
            <div className="bg-lime-400 text-black w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <img src={ic_register} alt="register icon" />
            </div>
            <h2 className="text-2xl font-semibold">Create an account</h2>
            <p className="text-gray-400 text-sm">
              Sign up now and unlock exclusive access!
            </p>
          </div>

          {/* Social Buttons */}
          <div className="flex justify-center space-x-3">
            {[ic_google, ic_fb, ic_ig, ic_x].map((platform) => (
              <button
                key={platform}
                className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition"
                disabled
                title="Tính năng đăng nhập mạng xã hội chưa được hỗ trợ"
              >
                <img src={platform} alt="social icon" className="w-5 h-5" />
              </button>
            ))}
          </div>

          {/* OR divider */}
          <div className="flex items-center space-x-2 text-gray-500">
            <hr className="flex-1 border-gray-600" />
            <span className="text-sm">OR</span>
            <hr className="flex-1 border-gray-600" />
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm">Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
                required
              />
            </div>
            <div className="relative">
              <label className="block mb-1 text-sm">Password *</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                placeholder="••••••••"
                className="w-full p-3 pr-10 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-[38px] text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <img src={view} className="h-6 w-6" alt="view password" />
                ) : (
                  <img src={hide} className="h-6 w-6" alt="hide password" />
                )}
              </button>
            </div>
            <div className="flex items-center text-xs space-x-2">
              <input type="checkbox" id="terms" className="accent-lime-400" />
              <label htmlFor="terms">
                I agree to the{" "}
                <a href="#" className="text-lime-400 underline">
                  terms of service
                </a>
              </label>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm">{success}</p>}

            <button
              type="submit"
              className="w-full bg-lime-400 text-black py-3 rounded-lg font-semibold hover:bg-lime-500 transition"
            >
              Sign up
            </button>
          </form>

          <p className="text-sm text-center text-gray-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-lime-400 font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block w-full bg-cover register-bg bg-center p-5">
          <img src={banner} className="w-full h-95" alt="banner" />
        </div>
      </div>
    </div>
  );
}

export default Register;
