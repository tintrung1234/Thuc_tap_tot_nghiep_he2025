const express = require("express");
const router = express.Router();
const reactionController = require("../controllers/reactionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/post/:postId", reactionController.getReactionCount);
router.get("/user/:postId", authMiddleware, reactionController.getUserReaction);
router.post("/", authMiddleware, reactionController.addReaction);

module.exports = router;
