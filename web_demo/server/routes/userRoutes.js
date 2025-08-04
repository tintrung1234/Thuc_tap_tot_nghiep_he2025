const express = require("express");
const router = express.Router();
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
const firebaseAuth = require("../middlewares/firebaseAuth");

const {
  createUser,
  getUser,
  updateUser,
  getLatestUsers,
  getAllUsers,
  updateUserByUid,
  deleteUser,
} = require("../controllers/userController");

router.get('/', getAllUsers);
router.post("/register", createUser);
router.get("/profile/:uid", getUser);
router.get("/latest", getLatestUsers);
router.put(
  "/profile/:uid",
  firebaseAuth,
  upload.single("file"),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "Ảnh quá lớn (tối đa 2MB)." });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  },
  updateUser
);

router.put("/update/:uid", updateUserByUid);

router.delete("/delete/:uid", deleteUser);

module.exports = router;
