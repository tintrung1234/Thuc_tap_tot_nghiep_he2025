const express = require("express");
const router = express.Router();
const auditLogController = require("../controllers/auditLogController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, auditLogController.getAllAuditLogs);
router.get("/:id", authMiddleware, auditLogController.getAuditLogById);
router.get("/stats", authMiddleware, auditLogController.getAuditLogStats);

module.exports = router;
