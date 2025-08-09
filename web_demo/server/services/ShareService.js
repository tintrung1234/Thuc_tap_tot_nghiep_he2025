const Share = require("../models/Share");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");

class ShareService {
  static async sharePost({ postId, sharedTo, userId, username }) {
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) throw new Error("Post not found");

    const share = new Share({ postId, userId, sharedTo });
    await share.save();

    await Post.updateOne({ _id: postId }, { $inc: { shares: 1 } });

    await AuditLog.logAction({
      userId,
      action: "create",
      resource: "Share",
      resourceId: share._id,
      details: `Shared post ${postId} to ${sharedTo}`,
    });

    if (post.uid !== userId) {
      await Notification.create({
        userId: post.uid,
        type: "share",
        relatedId: postId,
        message: `${username} shared your post: ${post.title}`,
      });
    }

    return share;
  }
}

module.exports = ShareService;
