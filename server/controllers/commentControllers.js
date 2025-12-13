const Comment = require("../models/commentModels");
const Review = require("../models/reviewModels");

// POST /api/reviews/:reviewId/comments
exports.createComment = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text, isVisibleToAuthor } = req.body;

    if (!text) return res.status(400).json({ error: "Missing text" });

    const review = await Review.findByPk(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (req.user.role !== "REVIEWER" && req.user.role !== "ORGANIZER") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const comment = await Comment.create({
      reviewId,
      text,
      isVisibleToAuthor: typeof isVisibleToAuthor === "boolean" ? isVisibleToAuthor : true,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/reviews/:reviewId/comments
exports.getCommentsByReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByPk(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const where = { reviewId };

    if (req.user.role === "AUTHOR") {
      where.isVisibleToAuthor = true;
    }

    const comments = await Comment.findAll({ where, order: [["createdAt", "ASC"]] });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

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
