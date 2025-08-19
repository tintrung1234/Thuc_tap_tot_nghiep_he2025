const express = require("express");
const router = express.Router();
const termsController = require("../controllers/termsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", termsController.getAllTerms);
router.get("/:id", termsController.getTermById);
router.post("/", authMiddleware, termsController.createTerm);
router.put("/:id", authMiddleware, termsController.updateTerm);
router.delete("/:id", authMiddleware, termsController.deleteTerm);

module.exports = router;
