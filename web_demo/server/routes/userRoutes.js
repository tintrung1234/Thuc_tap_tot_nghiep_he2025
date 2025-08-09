const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const reactionController = require("../controllers/reactionController");
const commentController = require("../controllers/commentController");
const shareController = require("../controllers/shareController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Định dạng ảnh không hợp lệ"), false);
    }
    cb(null, true);
  },
});

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/:uid", authMiddleware, userController.getUser);
router.put(
  "/:uid",
  authMiddleware,
  upload.single("photo"),
  userController.updateUser
);
router.get("/recent", authMiddleware, userController.getRecentUsers);
router.get("/", authMiddleware, userController.getAllUsers);
router.delete("/:uid", authMiddleware, userController.softDeleteUser);
router.put("/:uid/restore", authMiddleware, userController.restoreUser);
router.post("/reactions", authMiddleware, reactionController.addReaction);
router.post("/comments", authMiddleware, commentController.addComment);
router.post("/shares", authMiddleware, shareController.sharePost);

module.exports = router;
