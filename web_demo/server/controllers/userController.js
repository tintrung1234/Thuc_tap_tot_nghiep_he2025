const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// Register Endpoint
const createUser = async (req, res) => {
  console.log("Received registration request:", req.body);
  const { uid, email, username, role } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email or username already exists" });
    }

    const newUser = new User({ uid, email, username, role });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// Get User Profile Endpoint
const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Server error while fetching profile" });
  }
};

// Update User Profile
const updateUser = async (req, res) => {
  try {
    const uid = req.params.uid;
    const { username } = req.body;
    const removeAvatar = req.body.removeAvatar === "true";

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Nếu cần xoá ảnh cũ
    if (removeAvatar && user.publicId) {
      await cloudinary.uploader.destroy(user.publicId);
      user.photoUrl = "";
      user.publicId = "";
    }

    // Nếu có file mới → upload Cloudinary
    if (req.file) {
      if (user.publicId) {
        await cloudinary.uploader.destroy(user.publicId);
      }

      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });
      user.photoUrl = uploadResult.secure_url;
      user.publicId = uploadResult.public_id;
    }

    user.username = username || user.username;

    await user.save();

    res.json({
      message: "Cập nhật thành công",
      user: {
        uid: user.uid,
        username: user.username,
        email: user.email,
        photoUrl: user.photoUrl,
        publicId: user.publicId,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ message: "Lỗi cập nhật thông tin", error: error.message });
  }
};

const getLatestUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 }) // sắp xếp mới nhất trước
      .limit(8);

    res.json({ users });
  } catch (error) {
    console.error("Error fetching latest users:", error);
    res.status(500).json({ message: "Lỗi khi lấy người dùng mới", error });
  }
};

// lấy dữ liệu toàn bộ Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // Lấy tất cả và sắp xếp theo thời gian tạo mới nhất
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error while fetching users" });
  }
};

// Chỉnh sửa thông tin users
const updateUserByUid = async (req, res) => {
  try {
    const { uid } = req.params;
    const { username, email, role } = req.body;

    if (!username || !email || !uid) {
      return res.status(400).json({ error: 'Username, email và uid là bắt buộc' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { username, email, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    res.json({ message: 'Cập nhật người dùng thành công', user: updatedUser });
  } catch (error) {
    console.error('Lỗi cập nhật người dùng:', error);
    res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật người dùng' });
  }
};

// Controller xóa user
const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;

    // Kiểm tra uid có tồn tại không
    if (!uid) {
      return res.status(400).json({ error: "UID user không được cung cấp" });
    }

    const deletedUser = await User.findOneAndDelete({ uid });

    if (!deletedUser) {
      return res.status(404).json({ error: "Không tìm thấy user cần xóa" });
    }

    res.json({ message: "Xóa user thành công", user: deletedUser });
  } catch (error) {
    console.error("Lỗi khi xóa user:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi xóa user" });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  getLatestUsers,
  getAllUsers,
  updateUserByUid,
  deleteUser
};
