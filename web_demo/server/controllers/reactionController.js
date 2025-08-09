const ReactionService = require("../services/ReactionService");

const getReactionsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page, limit } = req.query;
    const result = await ReactionService.getReactionsByPost({
      postId,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getUserReactionForPost = async (req, res) => {
  try {
    const { postId, uid } = req.params;
    const reaction = await ReactionService.getUserReactionForPost({
      postId,
      userId: uid,
    });
    res.json(reaction);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const addReaction = async (req, res) => {
  try {
    const { postId, type } = req.body;
    const { uid, username } = req.user;
    const result = await ReactionService.addReaction({
      postId,
      type,
      userId: uid,
      username,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid, role } = req.user;
    const result = await ReactionService.deleteReaction({
      reactionId: id,
      userId: uid,
      userRole: role,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const getReactionStats = async (req, res) => {
  try {
    const { postId } = req.params;
    const stats = await ReactionService.getReactionStats({ postId });
    res.json(stats);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getReactionsByPost,
  getUserReactionForPost,
  addReaction,
  deleteReaction,
  getReactionStats,
};
