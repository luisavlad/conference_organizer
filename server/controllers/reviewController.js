const { Review } = require("../models");

exports.createReview = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { reviewerId, decision } = req.body;

    if (!reviewerId) {
      return res.status(400).json({ error: "reviewerId is required" });
    }

    const review = await Review.create({
      articleId,
      reviewerId,
      decision: decision || "pending",
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
