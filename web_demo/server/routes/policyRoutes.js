const express = require("express");
const router = express.Router();
const policyController = require("../controllers/policyController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", policyController.getAllPolicies);
router.get("/:id", policyController.getPolicyById);
router.post("/", authMiddleware, policyController.createPolicy);
router.put("/:id", authMiddleware, policyController.updatePolicy);
router.delete("/:id", authMiddleware, policyController.deletePolicy);

module.exports = router;
