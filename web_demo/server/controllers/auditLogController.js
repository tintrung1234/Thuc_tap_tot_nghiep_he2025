const AuditLogService = require("../services/AuditLogService");

const getAllAuditLogs = async (req, res) => {
  try {
    const { page, limit, userId, resource, action, startDate, endDate } =
      req.query;
    const { role } = req.user;
    const result = await AuditLogService.getAllAuditLogs({
      page: parseInt(page),
      limit: parseInt(limit),
      userId,
      resource,
      action,
      startDate,
      endDate,
      userRole: role,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const getAuditLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    const auditLog = await AuditLogService.getAuditLogById(id, role);
    res.json(auditLog);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getAuditLogStats = async (req, res) => {
  try {
    const { userId, resource, startDate, endDate } = req.query;
    const { role } = req.user;
    const stats = await AuditLogService.getAuditLogStats({
      userId,
      resource,
      startDate,
      endDate,
      userRole: role,
    });
    res.json(stats);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

module.exports = {
  getAllAuditLogs,
  getAuditLogById,
  getAuditLogStats,
};
