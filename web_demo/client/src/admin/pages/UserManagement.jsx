import { useState, useEffect, useMemo } from "react";
import UserTable from "../components/UserTable";
import CreateUserModal from "../components/CreateUserModal";
import EditUserModal from "../components/EditUserModal";
import { privateApi, publicApi } from "../../api/axios";
import { toast } from "react-toastify";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState({ users: true, posts: true });
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [sortKey, setSortKey] = useState("postCount");
  const [sortOrder, setSortOrder] = useState("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch users and posts concurrently
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập để truy cập!");
        setLoading({ users: false, posts: false });
        return;
      }

      try {
        const [usersRes, postsRes] = await Promise.all([
          privateApi.get("/users"),
          publicApi.get("/posts"),
        ]);

        const formattedPosts = postsRes.data.posts.map((post) => ({
          id: post._id,
          title: post.title,
          authorId: post.uid,
          date: new Date(post.createdAt).toISOString().split("T")[0],
          tags: post.tags || [],
          content: post.description,
          views: post.views || 0,
        }));
        setPosts(formattedPosts);
        setLoading((prev) => ({ ...prev, posts: false }));

        const formattedUsers = usersRes.data.users.map((user) => ({
          uid: user.uid,
          username: user.username,
          email: user.email,
          role: user.role,
          registered: new Date(user.createdAt).toISOString().split("T")[0],
          photoUrl: user.photoUrl,
          bio: user.bio,
          isActive: user.isActive,
          isDeleted: user.isDeleted,
          social: user.social,
          postCount: formattedPosts.filter((p) => p.authorId._id === user._id)
            .length,
        }));
        setUsers(formattedUsers);
        setLoading((prev) => ({ ...prev, users: false }));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        if (error.response?.status === 401) {
          toast.error("Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        } else {
          toast.error(
            error.response?.data?.error ||
              "Không thể tải dữ liệu người dùng hoặc bài viết!"
          );
        }
        setLoading({ users: false, posts: false });
      }
    };

    fetchData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("name");
    const role = formData.get("role") || "User";

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để tạo người dùng!");
      return;
    }

    try {
      const newUser = { email, username, password, role };
      const response = await privateApi.post("/users/register", newUser);
      toast.success(response.data.message || "Tạo người dùng thành công!");

      const res = await privateApi.get("/users");
      const formattedUsers = res.data.users.map((user) => ({
        uid: user.uid,
        username: user.username,
        email: user.email,
        role: user.role,
        registered: new Date(user.createdAt).toISOString().split("T")[0],
        photoUrl: user.photoUrl,
        bio: user.bio,
        isActive: user.isActive,
        isDeleted: user.isDeleted,
        social: user.social,
        postCount: posts.filter((p) => p.authorId === user.uid).length,
      }));
      setUsers(formattedUsers);
      setShowCreateUserModal(false);
      e.target.reset();
    } catch (error) {
      console.error("Lỗi khi tạo người dùng:", error);
      toast.error(error.response?.data?.error || "Tạo người dùng thất bại!");
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedUser = {
      username: formData.get("username"),
      email: formData.get("email"),
      photoUrl: formData.get("photoUrl"),
      bio: formData.get("bio"),
      role: formData.get("role"),
      isActive: formData.get("isActive") === "true",
      isDeleted: formData.get("isDeleted") === "true",
      social: {
        facebook: formData.get("social[facebook]"),
        twitter: formData.get("social[twitter]"),
        instagram: formData.get("social[instagram]"),
        linkedin: formData.get("social[linkedin]"),
      },
    };

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để cập nhật người dùng!");
      return;
    }

    try {
      const response = await privateApi.put(
        `/users/update/${currentUser.uid}`,
        updatedUser
      );
      toast.success(response.data.message || "Cập nhật người dùng thành công!");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === currentUser.uid
            ? { ...user, ...updatedUser, updatedAt: new Date() }
            : user
        )
      );
      setShowEditUserModal(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      toast.error(
        error.response?.data?.error || "Cập nhật người dùng thất bại!"
      );
    }
  };

  const handleDeleteUser = async (uid) => {
    if (!uid) {
      toast.error("ID người dùng không tồn tại!");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xóa người dùng!");
      return;
    }

    try {
      const response = await privateApi.delete(`/users/${uid}`);
      toast.success(response.data.message || "Xóa người dùng thành công!");
      setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== uid));
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      toast.error(error.response?.data?.error || "Xóa người dùng thất bại!");
    }
  };

  const openEditUserModal = (user) => {
    setCurrentUser(user);
    setShowEditUserModal(true);
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchesSearch = searchTerm
          ? user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        const matchesRole = selectedRole ? user.role === selectedRole : true;
        const matchesDate =
          startDate && endDate
            ? new Date(user.registered) >= new Date(startDate) &&
              new Date(user.registered) <= new Date(endDate)
            : true;
        return matchesSearch && matchesRole && matchesDate;
      })
      .sort((a, b) => {
        const order = sortOrder === "asc" ? 1 : -1;
        if (sortKey === "postCount") {
          return order * (a.postCount - b.postCount);
        }
        return order * a.username.localeCompare(b.username);
      });
  }, [users, searchTerm, selectedRole, startDate, endDate, sortKey, sortOrder]);

  const uniqueRoles = useMemo(
    () => [...new Set(users.map((user) => user.role))].sort(),
    [users]
  );

  const getPostCount = (userId) =>
    users.find((u) => u.uid === userId)?.postCount || 0;

  return (
    <div className="flex flex-col flex-1 overflow-x-auto min-h-screen bg-gray-100 p-4">
      <main className="bg-white rounded-lg shadow-md p-6">
        {loading.users || loading.posts ? (
          <div className="text-gray-500 text-center py-4">
            Đang tải dữ liệu...
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            uniqueRoles={uniqueRoles}
            sortKey={sortKey}
            sortOrder={sortOrder}
            handleSort={handleSort}
            openEditUserModal={openEditUserModal}
            handleDeleteUser={handleDeleteUser}
            setShowCreateUserModal={setShowCreateUserModal}
            getPostCount={getPostCount}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        )}
      </main>

      <CreateUserModal
        showCreateUserModal={showCreateUserModal}
        setShowCreateUserModal={setShowCreateUserModal}
        handleCreateUser={handleCreateUser}
      />
      <EditUserModal
        showEditUserModal={showEditUserModal}
        setShowEditUserModal={setShowEditUserModal}
        currentUser={currentUser}
        handleEditUser={handleEditUser}
      />
    </div>
  );
}

export default UserManagement;
