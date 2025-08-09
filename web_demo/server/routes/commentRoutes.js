const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/post/:postId", commentController.getCommentsByPost);
router.get("/:id", commentController.getCommentById);
router.post("/", authMiddleware, commentController.addComment);
router.put("/:id", authMiddleware, commentController.updateComment);
router.delete("/:id", authMiddleware, commentController.deleteComment);
router.get("/user/:uid", commentController.getCommentsByUser);

module.exports = router;
