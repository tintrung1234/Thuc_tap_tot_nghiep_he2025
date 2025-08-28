const UserService = require("../services/UserService");

const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const result = await UserService.register({ email, username, password });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.login({ email, password });
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await UserService.getUserById(uid);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const file = req.file;

    const updateData = {
      username: req.body.username,
      bio: req.body.bio,
      social: req.body.social,
      removeAvatar: req.body.removeAvatar,
    };

    const user = await UserService.updateUser({
      uid,
      updateData,
      file,
    });
    res.status(200).json({ user, message: "Cập nhật thông tin thành công" });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw createError(
        400,
        "Vui lòng cung cấp đầy đủ mật khẩu hiện tại và mật khẩu mới"
      );
    }

    const result = await UserService.changePassword(
      uid,
      currentPassword,
      newPassword
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getRecentUsers = async (req, res) => {
  try {
    const users = await UserService.getRecentUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await UserService.getAllUsers({
      role,
      currentUser: req.user,
    });
    res.json(users);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const softDeleteUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await UserService.softDeleteUser({
      uid,
      currentUser: req.user,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const restoreUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await UserService.restoreUser({
      uid,
      currentUser: req.user,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getUser,
  updateUser,
  getRecentUsers,
  getAllUsers,
  softDeleteUser,
  restoreUser,
  changePassword,
};
