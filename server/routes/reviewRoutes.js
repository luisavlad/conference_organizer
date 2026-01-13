const express = require("express");
const router = express.Router();
const { Review, Article } = require("../models");

// GET /api/reviews?reviewerId=xxx
router.get("/reviews", async (req, res, next) => {
  try {
    const { reviewerId } = req.query;
    const where = reviewerId ? { reviewerId } : {};

    const reviews = await Review.findAll({
      where,
      include: [{ model: Article }],
      order: [["createdAt", "DESC"]],
    });

    res.json(reviews);
  } catch (e) {
    next(e);
  }
});

// POST /api/articles/:articleId/reviews
router.post("/articles/:articleId/reviews", async (req, res, next) => {
  try {
    const { reviewerId, decision } = req.body;

    if (!reviewerId) {
      return res.status(400).json({ error: "reviewerId is required" });
    }

    const review = await Review.create({
      articleId: req.params.articleId,
      reviewerId,
      decision: decision || "pending",
    });

    res.status(201).json(review);
  } catch (e) {
    next(e);
  }
});

// PATCH /api/reviews/:reviewId
router.patch("/reviews/:reviewId", async (req, res, next) => {
  try {
    const { decision } = req.body;

    if (!["accept", "reject", "revision_required"].includes(decision)) {
      return res.status(400).json({ error: "Invalid decision" });
    }

    const review = await Review.findByPk(req.params.reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    await review.update({ decision });

    // Recalculate article status
    const allReviews = await Review.findAll({
      where: { articleId: review.articleId },
    });
    const decisions = allReviews.map((r) => r.decision);

    let status = "IN_REVIEW";
    if (decisions.includes("reject")) status = "REJECTED";
    else if (decisions.includes("revision_required"))
      status = "REVISION_REQUIRED";
    else if (decisions.every((d) => d === "accept")) status = "ACCEPTED";

    await Article.update({ status }, { where: { id: review.articleId } });

    res.json({ ok: true, articleStatus: status });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
