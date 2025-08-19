const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");
const createError = require("http-errors");

class UserService {
  static async register({ email, username, password }) {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
      isDeleted: false,
    });
    if (existingUser) {
      throw new Error("Email or username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      uid: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      email,
      username,
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign(
      { uid: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await AuditLog.logAction({
      userId: user.uid,
      action: "create",
      resource: "User",
      resourceId: user._id,
      details: `Registered new user: ${username}`,
    });

    return {
      user: { id: user._id, uid: user.uid, email, username, role: user.role },
      token,
    };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ email, isDeleted: false }).select(
      "+password"
    );
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign(
      { uid: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await AuditLog.logAction({
      userId: user.uid,
      action: "login",
      resource: "User",
      resourceId: user._id,
      details: `User logged in: ${user.username}`,
    });

    return {
      user: {
        id: user._id,
        uid: user.uid,
        email,
        username: user.username,
        role: user.role,
      },
      token,
    };
  }

  static async getUserById(uid) {
    const user = await User.findOne({ uid, isDeleted: false }).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );
    if (!user) {
      throw createError(404, "Người dùng không tồn tại");
    }
    return user;
  }

  static async updateUser({ uid, updateData, file }) {
    const user = await User.findOne({ uid, isDeleted: false });
    if (!user) throw new Error("User not found");

    // Handle username update and validation
    if (updateData.username && updateData.username !== user.username) {
      const usernameExists = await User.findOne({
        username: updateData.username,
        isDeleted: false,
      });
      if (usernameExists) {
        throw createError(400, "Tên người dùng đã tồn tại");
      }
      user.username = updateData.username;
    }

    // Handle bio update
    if (updateData.bio !== undefined) {
      user.bio = updateData.bio;
    }

    // Handle social links update
    if (updateData.social) {
      try {
        const social = JSON.parse(updateData.social);
        user.social = {
          facebook: social.facebook || user.social.facebook,
          twitter: social.twitter || user.social.twitter,
          instagram: social.instagram || user.social.instagram,
          linkedin: social.linkedin || user.social.linkedin,
        };
      } catch (error) {
        throw createError(400, "Dữ liệu mạng xã hội không hợp lệ");
      }
    }

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "avatar",
      });
      user.photoUrl = result.secure_url;
      await fs.unlink(file.path); // Xóa file tạm
    }

    if (updateData.removeAvatar === "true") {
      user.photoUrl = "";
    }

    user.updatedAt = Date.now();
    await user.save();

    await AuditLog.logAction({
      userId: user._id,
      action: "update",
      resource: "User",
      resourceId: user._id,
      details: `Updated user info: ${user.username}`,
    });

    return user;
  }

  static async changePassword(uid, currentPassword, newPassword) {
    const user = await User.findOne({ _id: uid, isDeleted: false }).select(
      "+password"
    );
    if (!user) {
      throw createError(404, "Người dùng không tồn tại");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw createError(400, "Mật khẩu hiện tại không đúng");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.updatedAt = Date.now();
    await user.save();
    return { message: "Đổi mật khẩu thành công" };
  }

  static async getRecentUsers() {
    return await User.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(8)
      .select("uid username email photoUrl createdAt");
  }

  static async getAllUsers({ role, currentUser }) {
    if (currentUser.role !== "Admin") {
      throw new Error("Unauthorized");
    }
    const query = { isDeleted: false };
    if (role) query.role = role;

    return await User.find(query)
      .sort({ createdAt: -1 })
      .select("uid username email role createdAt");
  }

  static async softDeleteUser({ uid, currentUser }) {
    if (currentUser.uid !== uid && currentUser.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    const user = await User.findOneAndUpdate(
      { uid, isDeleted: false },
      { isDeleted: true, updatedAt: Date.now() },
      { new: true }
    );
    if (!user) throw new Error("User not found");

    await AuditLog.logAction({
      userId: currentUser.uid,
      action: "soft_delete",
      resource: "User",
      resourceId: user._id,
      details: `Soft deleted user: ${user.username}`,
    });

    return { message: "User soft deleted" };
  }

  static async restoreUser({ uid, currentUser }) {
    if (currentUser.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    const user = await User.findOneAndUpdate(
      { uid, isDeleted: true },
      { isDeleted: false, updatedAt: Date.now() },
      { new: true }
    );
    if (!user) throw new Error("User not found");

    await AuditLog.logAction({
      userId: currentUser.uid,
      action: "restore",
      resource: "User",
      resourceId: user._id,
      details: `Restored user: ${user.username}`,
    });

    await Notification.create({
      userId: user.uid,
      type: "account_restored",
      relatedId: user._id,
      message: `Your account has been restored by an admin`,
    });

    return { message: "User restored" };
  }
}

module.exports = UserService;
