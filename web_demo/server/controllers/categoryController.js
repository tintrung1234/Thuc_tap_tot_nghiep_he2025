const CategoryService = require("../services/CategoryService");

const getAllCategories = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await CategoryService.getAllCategories({
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await CategoryService.getCategoryBySlug(slug);
    res.json(category);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { uid, username, role } = req.user;
    const category = await CategoryService.createCategory({
      name,
      description,
      userId: uid,
      username,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, description } = req.body;
    const { uid, role } = req.user;
    const category = await CategoryService.updateCategory({
      slug,
      name,
      description,
      userId: uid,
      userRole: role,
    });
    res.json(category);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const softDeleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { uid, role } = req.user;
    const result = await CategoryService.softDeleteCategory({
      slug,
      userId: uid,
      userRole: role,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const restoreCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { uid, role } = req.user;
    const result = await CategoryService.restoreCategory({
      slug,
      userId: uid,
      userRole: role,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  softDeleteCategory,
  restoreCategory,
};
