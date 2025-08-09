const PolicyService = require("../services/PolicyService");

const getAllPolicies = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await PolicyService.getAllPolicies({
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPolicyById = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await PolicyService.getPolicyById(id);
    res.json(policy);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createPolicy = async (req, res) => {
  try {
    const { title, content, version } = req.body;
    const { uid, username, role } = req.user;
    const policy = await PolicyService.createPolicy({
      title,
      content,
      version,
      userId: uid,
      username,
      userRole: role,
    });
    res.status(201).json(policy);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, version } = req.body;
    const { uid, role } = req.user;
    const policy = await PolicyService.updatePolicy({
      policyId: id,
      title,
      content,
      version,
      userId: uid,
      userRole: role,
    });
    res.json(policy);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid, role } = req.user;
    const result = await PolicyService.deletePolicy({
      policyId: id,
      userId: uid,
      userRole: role,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

module.exports = {
  getAllPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
};
