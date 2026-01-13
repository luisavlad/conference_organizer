const Comment = require("../models/commentModel");
const Review = require("../models/reviewModel");

exports.createComment = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text, isVisibleToAuthor } = req.body;

    if (!text) return res.status(400).json({ error: "Missing text" });

    const review = await Review.findByPk(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const comment = await Comment.create({
      reviewId,
      text,
      isVisibleToAuthor:
        typeof isVisibleToAuthor === "boolean" ? isVisibleToAuthor : true,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCommentsByReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isVisibleToAuthor } = req.query;

    const review = await Review.findByPk(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const where = { reviewId };

    // Filter by visibility if specified
    if (isVisibleToAuthor !== undefined) {
      where.isVisibleToAuthor = isVisibleToAuthor === "true";
    }

    const comments = await Comment.findAll({
      where,
      order: [["createdAt", "ASC"]],
    });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    await comment.destroy();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // doar admin-ul sterge
    if (req.user.role !== "ORGANIZER") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const deleted = await Comment.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Comment not found" });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
