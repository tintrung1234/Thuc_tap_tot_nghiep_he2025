const PostService = require("../services/PostService");
const createError = require("http-errors");

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

const getPostsByTags = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page, limit } = req.query;
    const result = await PostService.getPostsByTags({
      tagsSlug: slug,
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
    const { uid, title, description, content, category } = req.body;
    const tags = req.body.tags
      ? Array.isArray(req.body.tags)
        ? req.body.tags
        : [req.body.tags]
      : [];
    const image = req.file;

    const post = await PostService.createPost({
      uid,
      title,
      description,
      content,
      category,
      tags,
      image,
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
    const { title, description, content, category } = req.body;
    const tags = req.body.tags
      ? Array.isArray(req.body.tags)
        ? req.body.tags
        : [req.body.tags]
      : [];
    const image = req.file;
    const post = await PostService.updatePost(
      slug,
      { title, description, content, category, tags, image },
      req.user
    );
    res.status(200).json({ post, message: "Cập nhật bài viết thành công" });
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

const getPostCounts = async (req, res, next) => {
  try {
    const { postIds } = req.body;
    if (!Array.isArray(postIds) || postIds.length === 0) {
      throw createError(400, "postIds must be a non-empty array");
    }
    const counts = await PostService.getPostCounts(postIds);
    res.status(200).json(counts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  getPostsByCategory,
  getPostsByTags,
  getPostBySlug,
  getTopPost,
  getFeaturedPosts,
  getRecentPosts,
  createPost,
  getPostsByUser,
  updatePost,
  softDeletePost,
  getPostCounts,
};
