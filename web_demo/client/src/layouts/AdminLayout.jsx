import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/components/AdminSidebar";
import AdminHeader from "../admin/components/AdminHeader";
import { useState, useEffect } from "react";
import RequireAuthAdmin from "../middleware/RequireAuthAdmin";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <RequireAuthAdmin>
      <div className="flex h-screen">
        <AdminSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-auto p-4">
            <div className="w-full overflow-x-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </RequireAuthAdmin>
  );
};

export default AdminLayout;
