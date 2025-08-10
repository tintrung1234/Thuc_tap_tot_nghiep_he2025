import { useState, useEffect, useMemo } from "react";
import UserTable from "../components/UserTable";
import CreateUserModal from "../components/CreateUserModal";
import EditUserModal from "../components/EditUserModal";
import axios from "axios";
import { toast } from "react-toastify";
import RequireAuthAdmin from "../../middleware/RequireAuthAdmin";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [sortKey, setSortKey] = useState("postCount");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập để truy cập!");
        return;
      }

      try {
        const res = await axios.get("http://localhost:3000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedUsers = res.data.map((user) => ({
          uid: user.uid,
          name: user.username,
          email: user.email,
          role: user.role,
          registered: new Date(user.createdAt).toISOString().split("T")[0],
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Lỗi khi lấy user từ MongoDB:", error);
        toast.error("Không thể tải danh sách người dùng!");
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    };

    fetchUsers();
  }, []);

  // Fetch posts from API to support getPostCount
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập để truy cập!");
        return;
      }

      try {
        const res = await axios.get("http://localhost:3000/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedPosts = res.data.map((post) => ({
          id: post._id,
          title: post.title,
          authorId: post.uid,
          date: new Date(post.createdAt).toISOString().split("T")[0],
          tags: post.tags || [],
          content: post.description,
          likes: post.likes || 0,
        }));
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết từ MongoDB:", error);
        toast.error("Không thể tải danh sách bài viết!");
      }
    };

    fetchPosts();
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
      await axios.post("http://localhost:3000/api/users/register", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Tạo user thành công!");
      setShowCreateUserModal(false);
      e.target.reset();
      const res = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(
        res.data.map((user) => ({
          uid: user.uid,
          name: user.username,
          email: user.email,
          role: user.role,
          registered: new Date(user.createdAt).toISOString().split("T")[0],
        }))
      );
    } catch (error) {
      console.error("Lỗi khi tạo user:", error);
      toast.error(
        error?.response?.data?.error || "Có lỗi xảy ra khi tạo user!"
      );
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedUser = {
      username: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
    };

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để cập nhật người dùng!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/users/update/${currentUser.uid}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === currentUser.uid ? { ...user, ...updatedUser } : user
        )
      );

      setShowEditUserModal(false);
      toast.success("Cập nhật người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      toast.error("Không thể cập nhật người dùng!");
    }
  };

  const handleDeleteUser = async (uid) => {
    if (!uid) {
      alert("ID user không tồn tại.");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xóa người dùng!");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/users/delete/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== uid));
      toast.success("Xóa user thành công");
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
      toast.error(error?.response?.data?.error || "Xóa user thất bại!");
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
          ? user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        const matchesRole = selectedRole ? user.role === selectedRole : true;
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        const aPostCount = posts.filter((p) => p.authorId === a.uid).length;
        const bPostCount = posts.filter((p) => p.authorId === b.uid).length;
        const order = sortOrder === "asc" ? 1 : -1;
        return sortKey === "postCount"
          ? order * (aPostCount - bPostCount)
          : order * a.name.localeCompare(b.name);
      });
  }, [users, posts, searchTerm, selectedRole, sortKey, sortOrder]);

  const uniqueRoles = [...new Set(users.map((user) => user.role))].sort();

  const getPostCount = (userId) =>
    posts.filter((p) => p.authorId === userId).length;

  return (
    <div className="flex-col flex flex-1 overflow-x-auto min-h-screen bg-gray-100 p-4">
      <main className="bg-white rounded-lg shadow-md p-6">
        <UserTable
          users={users}
          posts={posts}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          uniqueRoles={uniqueRoles}
          sortKey={sortKey}
          sortOrder={sortOrder}
          filteredUsers={filteredUsers}
          handleSort={handleSort}
          setSelectedUser={setSelectedUser}
          openEditUserModal={openEditUserModal}
          handleDeleteUser={handleDeleteUser}
          setShowCreateUserModal={setShowCreateUserModal}
          getPostCount={getPostCount}
        />
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
