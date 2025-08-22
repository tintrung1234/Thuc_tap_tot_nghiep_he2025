const express = require("express");
const router = express.Router();
const shareController = require("../controllers/shareController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/post/:postId", shareController.getSharesByPost);
router.get("/:id", shareController.getShareById);
router.post("/", authMiddleware, shareController.sharePost);
router.delete("/:id", authMiddleware, shareController.deleteShare);
router.get("/user/:userId", authMiddleware, shareController.getSharesByUser);
router.get("/post/:postId/stats", shareController.getShareStats);

module.exports = router;
