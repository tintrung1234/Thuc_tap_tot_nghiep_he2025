const Post = require("../models/Post");
const User = require("../models/User");

exports.getStatistics = async (req, res) => {
  try {
    const totalBlogs = await Post.countDocuments({
      status: "published",
      isDeleted: false,
    });

    const totalViews = await Post.aggregate([
      { $match: { status: "published", isDeleted: false } },
      { $group: { _id: null, views: { $sum: "$views" } } },
    ]);

    const totalUsers = await User.countDocuments({
      isActive: "true",
      isDeleted: false,
    });

    res.json({
      totalBlogs,
      totalViews: totalViews[0]?.views || 0,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
