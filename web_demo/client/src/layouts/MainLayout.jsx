import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { Outlet } from "react-router-dom";
import ChatBox from "../components/ChatBox";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <ScrollToTop />
      <main className="flex-grow">
        <Outlet />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <ChatBox />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
