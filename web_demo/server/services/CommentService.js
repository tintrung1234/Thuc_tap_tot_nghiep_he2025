const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");

class CommentService {
  static async addComment({ postId, content, parentId, userId, username }) {
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) throw new Error("Post not found");

    if (parentId) {
      const parentComment = await Comment.findOne({
        _id: parentId,
        isDeleted: false,
      });
      if (!parentComment) throw new Error("Parent comment not found");
    }

    const comment = new Comment({ postId, userId, content, parentId });
    await comment.save();

    await AuditLog.logAction({
      userId,
      action: "create",
      resource: "Comment",
      resourceId: comment._id,
      details: `Commented on post ${postId}`,
    });

    if (post.uid !== userId) {
      await Notification.create({
        userId: post.uid,
        type: "comment",
        relatedId: postId,
        message: `${username} commented on your post: ${post.title}`,
      });
    }

    return comment;
  }
}

module.exports = CommentService;
