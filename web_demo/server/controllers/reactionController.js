const ReactionService = require("../services/ReactionService");

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
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addReaction };
