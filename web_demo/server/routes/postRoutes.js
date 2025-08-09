const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", postController.getAllPosts);
router.get("/search", postController.searchPosts);
router.get("/category/:slug", postController.getPostsByCategory);
router.get("/top", postController.getTopPost);
router.get("/recent", postController.getRecentPosts);
router.get("/:slug", postController.getPostBySlug);
router.post("/", authMiddleware, postController.createPost);
router.get("/user/:uid", postController.getPostsByUser);
router.put("/:slug", authMiddleware, postController.updatePost);
router.delete("/:slug", authMiddleware, postController.softDeletePost);

module.exports = router;
