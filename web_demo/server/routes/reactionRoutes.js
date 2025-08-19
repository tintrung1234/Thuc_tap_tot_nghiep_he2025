const express = require("express");
const router = express.Router();
const reactionController = require("../controllers/reactionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/post/:postId", reactionController.getReactionsByPost);
router.get(
  "/post/:postId/user/:uid",
  reactionController.getUserReactionForPost
);
router.post("/", authMiddleware, reactionController.addReaction);
router.delete("/:id", authMiddleware, reactionController.deleteReaction);
router.get("/post/:postId/stats", reactionController.getReactionStats);

module.exports = router;
