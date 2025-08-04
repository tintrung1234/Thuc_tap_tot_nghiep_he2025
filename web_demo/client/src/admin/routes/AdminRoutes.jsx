import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import UserManagement from "../pages/UserManagement";
import PostManagement from "../pages/PostManagement";
import AdminDashboard from "../components/AdminDashboard";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="posts" element={<PostManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
