const Reaction = require("../models/Reaction");
const AuditLog = require("../models/AuditLog");
const mongoose = require("mongoose");
const createError = require("http-errors");

class ReactionService {
  static async getUserReaction(postId, userId) {
    if (
      !mongoose.Types.ObjectId.isValid(postId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      throw createError(400, "Invalid post ID or user ID");
    }

    const reaction = await Reaction.findOne({
      postId,
      userId,
      isDeleted: false,
    });
    return {
      hasReacted: !!reaction,
      type: reaction ? reaction.type : null,
    };
  }

  static async getReactionCount(postId) {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw createError(400, "Invalid post ID");
    }

    const counts = await Reaction.aggregate([
      {
        $match: {
          postId: new mongoose.Types.ObjectId(postId),
          isDeleted: false,
        },
      },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    const breakdown = {
      like: 0,
      haha: 0,
      love: 0,
      wow: 0,
      sad: 0,
      angry: 0,
    };

    counts.forEach(({ _id, count }) => {
      breakdown[_id] = count;
    });

    const total = Object.values(breakdown).reduce(
      (sum, count) => sum + count,
      0
    );

    return { total, breakdown };
  }

  static async addReaction(postId, userId, type) {
    if (
      !mongoose.Types.ObjectId.isValid(postId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      throw createError(400, "Invalid post ID or user ID");
    }

    if (!["like", "haha", "love", "wow", "sad", "angry"].includes(type)) {
      throw createError(400, "Invalid reaction type");
    }

    const existingReaction = await Reaction.findOne({
      postId,
      userId,
      isDeleted: false,
    });
    if (existingReaction) {
      if (existingReaction.type === type) {
        throw createError(400, "User has already reacted with this type");
      }
      existingReaction.type = type;
      existingReaction.updatedAt = Date.now();
      await existingReaction.save();
      return existingReaction;
    }

    const reaction = new Reaction({ postId, userId, type });
    await reaction.save();
    await AuditLog.logAction({
      userId,
      action: "add_reaction",
      resource: "Reaction",
      resourceId: reaction._id,
      details: `Added reaction from post ${reaction.postId}`,
    });
    return reaction;
  }
}

module.exports = ReactionService;
