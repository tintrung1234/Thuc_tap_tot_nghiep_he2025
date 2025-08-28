import AuthorsList from "../components/AuthorsList";
import teamWork from "../assets/team_working_together.png";
import teamCreative from "../assets/team_of_creatives.png";
import weStarted from "../assets/why_we_started.png";
import SectionBlock from "../components/SectionBlock";
import JoinSection from "../components/JoinSection";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { publicApi } from "../api/axios";

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 giây
    const startTime = performance.now();

    const step = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}K+`;
    }
    return num;
  };

  return <h3 className="text-3xl font-bold">{formatNumber(count)}</h3>;
};

export default function AboutUsPage() {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalViews: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await publicApi.get(`/stats`);
        setStats(response.data);
      } catch (error) {
        toast.error("Không thể tải dữ liệu thống kê!");
        console.error("Error fetching stats:", error);
      }
    };
    getStats();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-2 py-12 ">
      {/* Header Section */}
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-gray-900 mt-2">
          We are a team of content writers who share their learnings
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </div>

      {/* Image with Statistics Section */}
      <div className="relative mb-12" data-aos="zoom-in">
        <img
          src={teamWork}
          alt="Team working together"
          className="w-full h-96 object-cover rounded-lg"
        />
        <div className="absolute inset-0 flex justify-around items-center text-white">
          <div className="bg-yellow-400 text-black p-4 rounded-lg text-center">
            <AnimatedCounter value={stats.totalBlogs} />
            <p>Blogs Published</p>
          </div>
          <div className="bg-yellow-400 text-black p-4 rounded-lg text-center">
            <AnimatedCounter value={stats.totalViews} />
            <p>Views on Finsweet</p>
          </div>
          <div className="bg-yellow-400 text-black p-4 rounded-lg text-center">
            <AnimatedCounter value={stats.totalUsers} />
            <p>Total Active Users</p>
          </div>
        </div>
      </div>

      {/* Mission and Vision Section */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-12 rounded-lg mb-12"
        data-aos="fade-up"
      >
        {/* OUR MISSION */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
            🚀 OUR MISSION
          </h2>
          <h3 className="text-xl font-bold text-gray-900">
            Creating valuable content for creatives all around the world
          </h3>
          <p className="text-gray-600 mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Non
            blandit massa enim nec. Scelerisque viverra mauris in aliquam sem.
            At risus viverra adipiscing at in tellus.
          </p>
        </div>

        {/* OUR VISION */}
        <div className="bg-green-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
            🌟 OUR VISION
          </h2>
          <h3 className="text-xl font-bold text-gray-900">
            A platform that empowers individuals to improve
          </h3>
          <p className="text-gray-600 mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Non
            blandit massa enim nec. Scelerisque viverra mauris in aliquam sem.
            At risus viverra adipiscing at in tellus.
          </p>
        </div>
      </div>

      <SectionBlock
        image={teamCreative}
        title="Our team of creatives"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
        content={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.`}
      />

      <SectionBlock
        image={weStarted}
        title="Why we started this Blog"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
        content={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.`}
        reverse={true}
      />

      {/* Authors List Section */}
      <AuthorsList />
      <JoinSection />
    </div>
  );
}
