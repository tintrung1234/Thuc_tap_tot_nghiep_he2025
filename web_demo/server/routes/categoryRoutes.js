const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", categoryController.getAllCategories);
router.get("/:slug", categoryController.getCategoryBySlug);
router.post("/", authMiddleware, categoryController.createCategory);
router.put("/:slug", authMiddleware, categoryController.updateCategory);
router.delete("/:slug", authMiddleware, categoryController.softDeleteCategory);
router.put(
  "/:slug/restore",
  authMiddleware,
  categoryController.restoreCategory
);

module.exports = router;
