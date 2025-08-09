const UserService = require("../services/UserService");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

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
    const user = await UserService.getUser(uid);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { username, bio, social } = req.body;
    const file = req.file;
    const user = await UserService.updateUser({
      uid,
      username,
      bio,
      social,
      file,
      currentUser: req.user,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  updateUser: [upload.single("photo"), updateUser],
  getRecentUsers,
  getAllUsers,
  softDeleteUser,
  restoreUser,
};
