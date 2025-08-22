const ShareService = require("../services/ShareService");

const getSharesByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page, limit } = req.query;
    const result = await ShareService.getSharesByPost({
      postId,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getShareById = async (req, res) => {
  try {
    const { id } = req.params;
    const share = await ShareService.getShareById(id);
    res.json(share);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const sharePost = async (req, res) => {
  try {
    const { postId, platform } = req.body;
    const { uid, username } = req.user;
    const share = await ShareService.sharePost({
      postId,
      platform,
      userId: uid,
      username,
    });
    res.status(201).json(share);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteShare = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid, role } = req.user;
    const result = await ShareService.deleteShare({
      shareId: id,
      userId: uid,
      userRole: role,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const getSharesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;
    const result = await ShareService.getSharesByUser({
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getShareStats = async (req, res) => {
  try {
    const { postId } = req.params;
    const stats = await ShareService.getShareStats({ postId });
    res.json(stats);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getSharesByPost,
  getShareById,
  sharePost,
  deleteShare,
  getSharesByUser,
  getShareStats,
};
