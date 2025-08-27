const reactionService = require("../services/reactionService");

const reactionController = {
  async getReactionCount(req, res, next) {
    try {
      const { postId } = req.params;
      const result = await reactionService.getReactionCount(postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getUserReaction(req, res, next) {
    try {
      const { postId } = req.params;
      const userId = req.user.uid;
      const result = await reactionService.getUserReaction(postId, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async addReaction(req, res, next) {
    try {
      const { postId, type } = req.body;
      const userId = req.user.uid;
      const reaction = await reactionService.addReaction(postId, userId, type);
      res.status(201).json(reaction);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = reactionController;
