const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");

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
      { uid: user.uid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await AuditLog.logAction({
      userId: user.uid,
      action: "create",
      resource: "User",
      resourceId: user._id,
      details: `Registered new user: ${username}`,
    });

    return { user: { uid: user.uid, email, username, role: user.role }, token };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ email, isDeleted: false }).select(
      "+password"
    );
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign(
      { uid: user.uid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await AuditLog.logAction({
      userId: user.uid,
      action: "login",
      resource: "User",
      resourceId: user._id,
      details: `User logged in: ${user.username}`,
    });

    return {
      user: { uid: user.uid, email, username: user.username, role: user.role },
      token,
    };
  }

  static async getUser(uid) {
    const user = await User.findOne({ uid, isDeleted: false }, "-password");
    if (!user) throw new Error("User not found");
    return user;
  }

  static async updateUser({ uid, username, bio, social, file, currentUser }) {
    if (currentUser.uid !== uid && currentUser.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    const user = await User.findOne({ uid, isDeleted: false });
    if (!user) throw new Error("User not found");

    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (social) user.social = { ...user.social, ...social };

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "user_photos",
        public_id: `user_${uid}_${Date.now()}`,
      });
      user.photoUrl = result.secure_url;
      user.publicId = result.public_id;
      await fs.unlink(file.path); // Xóa file tạm
    }

    await user.save();

    await AuditLog.logAction({
      userId: currentUser.uid,
      action: "update",
      resource: "User",
      resourceId: user._id,
      details: `Updated user info: ${user.username}`,
    });

    return user;
  }

  static async getRecentUsers() {
    return await User.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(10)
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
