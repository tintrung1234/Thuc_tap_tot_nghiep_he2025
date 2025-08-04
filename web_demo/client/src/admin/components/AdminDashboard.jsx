import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalCategories: 0,
    lastUpdate: "",
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Số bài đăng",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, postsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users"),
          axios.get("http://localhost:5000/api/posts"),
        ]);

        const totalUsers = usersRes.data.length;
        const totalPosts = postsRes.data.length;
        const totalCategories = [
          ...new Set(
            postsRes.data.map((post) => post.category).filter(Boolean)
          ),
        ].length;

        setStats({
          totalUsers,
          totalPosts,
          totalCategories,
          lastUpdate: new Date().toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
          }),
        });

        // Aggregate posts by date
        const postsByDate = postsRes.data.reduce((acc, post) => {
          const date = new Date(post.createdAt).toLocaleDateString("en-CA"); // YYYY-MM-DD
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const labels = Object.keys(postsByDate);
        const data = Object.values(postsByDate);

        setChartData({
          labels,
          datasets: [
            {
              label: "Số bài đăng",
              data,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
        toast.error("Không thể tải thống kê!");
      }
    };

    fetchStats();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Số bài đăng theo ngày",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Số lượng" },
      },
      x: {
        title: { display: true, text: "Ngày" },
      },
    },
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            Tổng số người dùng
          </h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            Tổng số bài viết
          </h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalPosts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            Tổng số danh mục
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.totalCategories}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            Cập nhật lần cuối
          </h3>
          <p className="text-md text-gray-600">{stats.lastUpdate}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AdminDashboard;
