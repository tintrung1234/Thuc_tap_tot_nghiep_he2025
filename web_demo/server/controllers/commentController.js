const CommentService = require("../services/CommentService");

const addComment = async (req, res) => {
  try {
    const { postId, content, parentId } = req.body;
    const { uid, username } = req.user;
    const comment = await CommentService.addComment({
      postId,
      content,
      parentId,
      userId: uid,
      username,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addComment };
