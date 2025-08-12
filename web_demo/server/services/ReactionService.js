const Reaction = require("../models/Reaction");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");

class ReactionService {
  static async getReactionsByPost({ postId, page = 1, limit = 10 }) {
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) throw new Error("Post not found");

    const skip = (page - 1) * limit;
    const reactions = await Reaction.find({ postId, isDeleted: false })
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("userId type createdAt");
    const total = await Reaction.countDocuments({ postId, isDeleted: false });
    return { reactions, total, page, limit };
  }

  static async getUserReactionForPost({ postId, userId }) {
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) throw new Error("Post not found");

    const reaction = await Reaction.findOne({
      postId,
      userId,
      isDeleted: false,
    })
      .populate("userId", "username")
      .select("userId type createdAt");
    return reaction || null;
  }

  static async addReaction({ postId, type, userId, username }) {
    const validTypes = ["like", "love", "haha", "wow", "sad", "angry"];
    if (!validTypes.includes(type)) throw new Error("Invalid reaction type");

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
        await AuditLog.logAction({
          userId,
          action: "update",
          resource: "Reaction",
          resourceId: reaction._id,
          details: `Updated reaction to ${type} for post ${postId}`,
        });
      }
    } else {
      reaction = new Reaction({ postId, userId, type });
      await reaction.save();
      await AuditLog.logAction({
        userId,
        action: "create",
        resource: "Reaction",
        resourceId: reaction._id,
        details: `Added ${type} reaction to post ${postId}`,
      });
    }

    if (post.uid !== userId) {
      await Notification.create({
        userId: post.uid,
        type: "reaction",
        relatedId: postId,
        message: `${username} reacted ${type} to your post: ${post.title}`,
      });
    }

    return reaction;
  }

  static async deleteReaction({ reactionId, userId, userRole }) {
    const reaction = await Reaction.findOne({
      _id: reactionId,
      isDeleted: false,
    });
    if (!reaction) throw new Error("Reaction not found");

    if (reaction.userId !== userId && userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    await Reaction.updateOne({ _id: reactionId }, { isDeleted: true });

    await AuditLog.logAction({
      userId,
      action: "soft_delete",
      resource: "Reaction",
      resourceId: reaction._id,
      details: `Deleted reaction from post ${reaction.postId}`,
    });

    return { message: "Reaction deleted" };
  }

  static async getReactionStats({ postId }) {
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) throw new Error("Post not found");

    const stats = await Reaction.aggregate([
      { $match: { postId: post._id, isDeleted: false } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $project: { type: "$_id", count: 1, _id: 0 } },
    ]);

    return stats;
  }
}

module.exports = ReactionService;
