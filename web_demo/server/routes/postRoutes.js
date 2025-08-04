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
  getAllPosts,
  searchPosts,
  getPostsByTag,
  getPostsByCategory,
  getPostDetail,
  getTop1Blog,
  getPostsNewest,
  createPost,
  getPostsByUser,
  updatePost,
  deletePost,
} = require("../controllers/postController");

// Lấy tất cả bài viết
router.get("/", getAllPosts);

// Tìm kiếm bài viết theo query text
router.get("/search", searchPosts);

// Lấy bài viết theo tag
router.get("/tag/:tag", getPostsByTag);

// Lấy bài viết theo category
router.get("/category/:category", getPostsByCategory);

// Lấy bài viết chi tiết
router.get("/detail/:id", getPostDetail);

// Lấy bài viết top 1
router.get("/topblog", getTop1Blog);

// Lấy bài viết mới nhất
router.get("/newest", getPostsNewest);

// Tạo bài viết
router.post("/create", upload.single("image"), firebaseAuth, createPost);

// Lấy bài theo user
router.get("/user/:uid", getPostsByUser);

// Cập nhật bài viết theo user
router.put(
  "/update/:id",
  firebaseAuth,
  upload.single("image"),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "Ảnh quá lớn (tối đa 2MB)." });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  },
  updatePost
);

router.delete("/delete/:id", firebaseAuth, deletePost);

module.exports = router;
