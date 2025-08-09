const Reaction = require("../models/Reaction");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");

class ReactionService {
  static async addReaction({ postId, type, userId, username }) {
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) throw new Error("Post not found");

    let reaction = await Reaction.findOne({ postId, userId, isDeleted: false });
    if (reaction) {
      if (reaction.type === type) {
        await Reaction.updateOne({ _id: reaction._id }, { isDeleted: true });
        await AuditLog.logAction({
          userId,
          action: "soft_delete",
          resource: "Reaction",
          resourceId: reaction._id,
          details: `Removed ${type} reaction from post ${postId}`,
        });
        return { message: "Reaction removed" };
      } else {
        reaction.type = type;
        await reaction.save();
      }
    } else {
      reaction = new Reaction({ postId, userId, type });
      await reaction.save();
    }

    await AuditLog.logAction({
      userId,
      action: reaction.isNew ? "create" : "update",
      resource: "Reaction",
      resourceId: reaction._id,
      details: `Reacted ${type} to post ${postId}`,
    });

    if (post.uid !== userId) {
      await Notification.create({
        userId: post.uid,
        type: "like",
        relatedId: postId,
        message: `${username} reacted ${type} to your post: ${post.title}`,
      });
    }

    return reaction;
  }
}

module.exports = ReactionService;
