const CommentLike = require('../models/CommentLike');

// Получить количество лайков комментария
exports.getLikesCount = async (req, res) => {
  try {
    const count = await CommentLike.count({
      where: { commentId: req.params.commentId }
    });
    res.json({ likes: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить статус лайка (лайкнул ли текущий пользователь)
exports.getLikeStatus = async (req, res) => {
  try {
    const like = await CommentLike.findOne({
      where: {
        userId: req.user.id,
        commentId: req.params.commentId
      }
    });
    res.json({ liked: !!like });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Поставить/убрать лайк
exports.toggleLike = async (req, res) => {
  try {
    const existing = await CommentLike.findOne({
      where: {
        userId: req.user.id,
        commentId: req.params.commentId
      }
    });

    if (existing) {
      await existing.destroy();
      res.json({ liked: false });
    } else {
      await CommentLike.create({
        userId: req.user.id,
        commentId: req.params.commentId
      });
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};