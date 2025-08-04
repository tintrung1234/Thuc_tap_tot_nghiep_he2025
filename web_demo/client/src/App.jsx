import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EditPostPage from "./pages/EditPostPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import AboutUsPage from "./pages/AboutUsPage";
import BlogPage from "./pages/BlogPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import TagPage from "./pages/TagPage";
import CategoryPage from "./pages/CategoryPage";
import WriteBlogPage from "./pages/WriteBlogPage";
import BlogDetail from "./pages/BlogDetail";
import AuthorPage from "./pages/AuthorPage";
import NotFoundPage from "./pages/Error404";
import AdminRoutes from "./admin/routes/AdminRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./layouts/MainLayout";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 👤 Main User Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/edit-post/:id" element={<EditPostPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/tags/:tag" element={<TagPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/write-blog" element={<WriteBlogPage />} />
          <Route path="/detail/:id" element={<BlogDetail />} />
          <Route path="/author" element={<AuthorPage />} />
          <Route path="/not-found-page" element={<NotFoundPage />} />
        </Route>

        {/* 🛠 Admin Layout (gọi trong AdminRoutes.jsx) */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={4000} />
    </Router>
  );
};

export default App;
