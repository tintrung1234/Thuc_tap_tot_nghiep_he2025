const TermsService = require("../services/TermsService");

const getAllTerms = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await TermsService.getAllTerms({
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTermById = async (req, res) => {
  try {
    const { id } = req.params;
    const term = await TermsService.getTermById(id);
    res.json(term);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createTerm = async (req, res) => {
  try {
    const { title, content, version } = req.body;
    const { uid, username, role } = req.user;
    const term = await TermsService.createTerm({
      title,
      content,
      version,
      userId: uid,
      username,
      userRole: role,
    });
    res.status(201).json(term);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const updateTerm = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, version } = req.body;
    const { uid, role } = req.user;
    const term = await TermsService.updateTerm({
      termId: id,
      title,
      content,
      version,
      userId: uid,
      userRole: role,
    });
    res.json(term);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const deleteTerm = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid, role } = req.user;
    const result = await TermsService.deleteTerm({
      termId: id,
      userId: uid,
      userRole: role,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

module.exports = {
  getAllTerms,
  getTermById,
  createTerm,
  updateTerm,
  deleteTerm,
};
