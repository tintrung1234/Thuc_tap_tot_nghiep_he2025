const PostService = require("../services/PostService");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const getAllPosts = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await PostService.getAllPosts({
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchPosts = async (req, res) => {
  try {
    const { query, page, limit } = req.query;
    if (!query) throw new Error("Query is required");
    const result = await PostService.searchPosts({
      query,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPostsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page, limit } = req.query;
    const result = await PostService.getPostsByCategory({
      categorySlug: slug,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await PostService.getPostBySlug(slug);
    res.json(post);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getTopPost = async (req, res) => {
  try {
    const post = await PostService.getTopPost();
    res.json(post);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getFeaturedPosts = async (req, res) => {
  try {
    const { limit } = req.query;
    const posts = await PostService.getFeaturedPosts(parseInt(limit) || 5);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecentPosts = async (req, res) => {
  try {
    const { limit } = req.query;
    const posts = await PostService.getRecentPosts(parseInt(limit) || 15);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, description, content, categoryId, tags } = req.body;
    const file = req.file;
    const { uid, username } = req.user;
    const post = await PostService.createPost({
      title,
      description,
      content,
      categoryId,
      tags,
      file,
      userId: uid,
      username,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostsByUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { page, limit } = req.query;
    const result = await PostService.getPostsByUser({
      uid,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, description, content, categoryId, tags } = req.body;
    const file = req.file;
    const { uid, role } = req.user;
    const post = await PostService.updatePost({
      slug,
      title,
      description,
      content,
      categoryId,
      tags,
      file,
      userId: uid,
      currentUser: req.user,
    });
    res.json(post);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const softDeletePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const { uid, role } = req.user;
    const result = await PostService.softDeletePost({
      slug,
      userId: uid,
      currentUser: req.user,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

module.exports = {
  getAllPosts,
  searchPosts,
  getPostsByCategory,
  getPostBySlug,
  getTopPost,
  getFeaturedPosts,
  getRecentPosts,
  createPost: [upload.single("image"), createPost],
  getPostsByUser,
  updatePost: [upload.single("image"), updatePost],
  softDeletePost,
};
