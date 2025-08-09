const ShareService = require("../services/ShareService");

const sharePost = async (req, res) => {
  try {
    const { postId, sharedTo } = req.body;
    const { uid, username } = req.user;
    const share = await ShareService.sharePost({
      postId,
      sharedTo,
      userId: uid,
      username,
    });
    res.status(201).json(share);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sharePost };
