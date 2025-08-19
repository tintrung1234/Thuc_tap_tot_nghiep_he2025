const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");

const upload = multer({
  dest: "uploads/",
});

router.get("/", postController.getAllPosts);
router.get("/search", postController.searchPosts);
router.get("/category/:slug", postController.getPostsByCategory);
router.get("/tags/:slug", postController.getPostsByTags);
router.get("/top", postController.getTopPost);
router.get("/featured", postController.getFeaturedPosts);
router.get("/recent", postController.getRecentPosts);
router.get("/:slug", postController.getPostBySlug);
router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  postController.createPost
);
router.get("/user/:uid", postController.getPostsByUser);
router.put(
  "/update/:slug",
  authMiddleware,
  upload.single("image"),
  postController.updatePost
);
router.delete("/:slug", authMiddleware, postController.softDeletePost);

module.exports = router;
