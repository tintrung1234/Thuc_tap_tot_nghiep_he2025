const Share = require("../models/Share");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");

class ShareService {
  static async getSharesByPost({ postId, page = 1, limit = 10 }) {
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) throw new Error("Post not found");

    const skip = (page - 1) * limit;
    const shares = await Share.find({ postId, isDeleted: false })
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("userId postId platform createdAt");
    const total = await Share.countDocuments({ postId, isDeleted: false });
    return { shares, total, page, limit };
  }

  static async getShareById(shareId) {
    const share = await Share.findOne({ _id: shareId, isDeleted: false })
      .populate("userId", "username")
      .populate("postId", "title slug")
      .select("userId postId platform createdAt");
    if (!share) throw new Error("Share not found");
    return share;
  }

  static async sharePost({ postId, platform, userId, username }) {
    const validPlatforms = ["facebook", "twitter", "linkedin", "email"];
    if (!validPlatforms.includes(platform)) throw new Error("Invalid platform");

    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) throw new Error("Post not found");

    const share = new Share({ postId, userId, platform });
    await share.save();

    await Post.updateOne({ _id: postId }, { $inc: { shares: 1 } });

    await AuditLog.logAction({
      userId,
      action: "create",
      resource: "Share",
      resourceId: share._id,
      details: `Shared post ${postId} on ${platform}`,
    });

    if (post.uid !== userId) {
      await Notification.create({
        userId: post.uid,
        type: "share",
        relatedId: postId,
        message: `${username} shared your post: ${post.title} on ${platform}`,
      });
    }

    return share;
  }

  static async deleteShare({ shareId, userId, userRole }) {
    const share = await Share.findOne({ _id: shareId, isDeleted: false });
    if (!share) throw new Error("Share not found");

    if (share.userId !== userId && userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    await Share.updateOne({ _id: shareId }, { isDeleted: true });
    await Post.updateOne({ _id: share.postId }, { $inc: { shares: -1 } });

    await AuditLog.logAction({
      userId,
      action: "soft_delete",
      resource: "Share",
      resourceId: share._id,
      details: `Deleted share for post ${share.postId}`,
    });

    return { message: "Share deleted" };
  }

  static async getSharesByUser({ userId, page = 1, limit = 10 }) {
    const user = await User.findOne({ uid: userId, isDeleted: false });
    if (!user) throw new Error("User not found");

    const skip = (page - 1) * limit;
    const shares = await Share.find({ userId, isDeleted: false })
      .populate("postId", "title slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("postId platform createdAt");
    const total = await Share.countDocuments({ userId, isDeleted: false });
    return { shares, total, page, limit };
  }

  static async getShareStats({ postId }) {
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) throw new Error("Post not found");

    const stats = await Share.aggregate([
      { $match: { postId: post._id, isDeleted: false } },
      { $group: { _id: "$platform", count: { $sum: 1 } } },
      { $project: { platform: "$_id", count: 1, _id: 0 } },
    ]);

    const total = await Share.countDocuments({
      postId: post._id,
      isDeleted: false,
    });

    return { stats, total };
  }
}

module.exports = ShareService;
