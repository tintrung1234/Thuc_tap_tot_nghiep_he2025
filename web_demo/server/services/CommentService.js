const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");

class CommentService {
  static async getCommentsByPost({ postId, page = 1, limit = 10 }) {
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) throw new Error("Post not found");

    const skip = (page - 1) * limit;
    const comments = await Comment.find({ postId, isDeleted: false })
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("userId content createdAt");
    const total = await Comment.countDocuments({ postId, isDeleted: false });
    return { comments, total, page, limit };
  }

  static async getCommentById(commentId) {
    const comment = await Comment.findOne({ _id: commentId, isDeleted: false })
      .populate("userId", "username")
      .populate("postId", "title slug")
      .select("userId postId content createdAt");
    if (!comment) throw new Error("Comment not found");
    return comment;
  }

  static async addComment({ postId, content, userId, username }) {
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) throw new Error("Post not found");

    const comment = new Comment({ postId, userId, content });
    await comment.save();

    await AuditLog.logAction({
      userId,
      action: "create",
      resource: "Comment",
      resourceId: comment._id,
      details: `Added comment to post ${postId}`,
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

  static async updateComment({ commentId, content, userId, userRole }) {
    const comment = await Comment.findOne({ _id: commentId, isDeleted: false });
    if (!comment) throw new Error("Comment not found");

    if (comment.userId !== userId && userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    comment.content = content;
    await comment.save();

    await AuditLog.logAction({
      userId,
      action: "update",
      resource: "Comment",
      resourceId: comment._id,
      details: `Updated comment on post ${comment.postId}`,
    });

    return comment;
  }

  static async deleteComment({ commentId, userId, userRole }) {
    const comment = await Comment.findOne({ _id: commentId, isDeleted: false });
    if (!comment) throw new Error("Comment not found");

    if (comment.userId !== userId && userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    await Comment.updateOne({ _id: commentId }, { isDeleted: true });

    await AuditLog.logAction({
      userId,
      action: "soft_delete",
      resource: "Comment",
      resourceId: comment._id,
      details: `Deleted comment on post ${comment.postId}`,
    });

    return { message: "Comment deleted" };
  }

  static async getCommentsByUser({ userId, page = 1, limit = 10 }) {
    const user = await User.findOne({ uid: userId, isDeleted: false });
    if (!user) throw new Error("User not found");

    const skip = (page - 1) * limit;
    const comments = await Comment.find({ userId, isDeleted: false })
      .populate("postId", "title slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("postId content createdAt");
    const total = await Comment.countDocuments({ userId, isDeleted: false });
    return { comments, total, page, limit };
  }
}

module.exports = CommentService;
