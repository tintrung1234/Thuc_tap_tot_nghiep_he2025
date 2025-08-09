const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", tagController.getAllTags);
router.get("/:slug", tagController.getTagBySlug);
router.post("/", authMiddleware, tagController.createTag);
router.put("/:slug", authMiddleware, tagController.updateTag);
router.delete("/:slug", authMiddleware, tagController.softDeleteTag);
router.put("/:slug/restore", authMiddleware, tagController.restoreTag);
router.get("/:slug/posts", tagController.getPostsByTag);

module.exports = router;
