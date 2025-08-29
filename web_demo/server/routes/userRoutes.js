const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");

const upload = multer({
  dest: "uploads/",
});

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/recent", userController.getRecentUsers);
router.get("/", authMiddleware, userController.getAllUsers);
router.put("/:uid/restore", authMiddleware, userController.restoreUser);
router.get("/:uid", authMiddleware, userController.getUser);
router.put(
  "/:uid",
  authMiddleware,
  upload.single("photo"),
  userController.updateUser
);
router.post("/change-password", authMiddleware, userController.changePassword);
router.delete("/:uid", authMiddleware, userController.softDeleteUser);
router.put("/update/:uid", authMiddleware, userController.updateUserByAdmin);
module.exports = router;
