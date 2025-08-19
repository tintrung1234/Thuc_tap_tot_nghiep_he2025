const TagService = require("../services/TagService");

const getAllTags = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await TagService.getAllTags({
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTagBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const tag = await TagService.getTagBySlug(slug);
    res.json(tag);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { uid } = req.user;
    const tag = await TagService.createTag({
      name,
      description,
      userId: uid,
    });
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTag = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, description } = req.body;
    const { uid, role } = req.user;
    const tag = await TagService.updateTag({
      slug,
      name,
      description,
      userId: uid,
      userRole: role,
    });
    res.json(tag);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const softDeleteTag = async (req, res) => {
  try {
    const { slug } = req.params;
    const { uid, role } = req.user;
    const result = await TagService.softDeleteTag({
      slug,
      userId: uid,
      userRole: role,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const restoreTag = async (req, res) => {
  try {
    const { slug } = req.params;
    const { uid, role } = req.user;
    const result = await TagService.restoreTag({
      slug,
      userId: uid,
      userRole: role,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const getPostsByTag = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page, limit } = req.query;
    const result = await TagService.getPostsByTag({
      tagSlug: slug,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getAllTags,
  getTagBySlug,
  createTag,
  updateTag,
  softDeleteTag,
  restoreTag,
  getPostsByTag,
};
