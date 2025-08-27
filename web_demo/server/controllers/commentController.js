const CommentService = require("../services/CommentService");

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page, limit } = req.query;
    const result = await CommentService.getCommentsByPost({
      postId,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await CommentService.getCommentById(id);
    res.json(comment);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const { uid } = req.user;
    const comment = await CommentService.addComment({
      postId,
      content,
      userId: uid,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const { uid, role } = req.user;
    const comment = await CommentService.updateComment({
      commentId: id,
      content,
      userId: uid,
      userRole: role,
    });
    res.json(comment);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid, role } = req.user;
    const result = await CommentService.deleteComment({
      commentId: id,
      userId: uid,
      userRole: role,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const getCommentsByUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { page, limit } = req.query;
    const result = await CommentService.getCommentsByUser({
      userId: uid,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getCommentsByPost,
  getCommentById,
  addComment,
  updateComment,
  deleteComment,
  getCommentsByUser,
};
