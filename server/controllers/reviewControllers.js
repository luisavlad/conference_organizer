const Review = require('../models/reviewModels');

// POST /api/articles/:articleId/reviews
exports.createReview = async (req, res) => {
  try {
    const { articleId } = req.params;
    const reviewerId = req.user.userId;

    const review = await Review.create({
      articleId,
      reviewerId,
      decision: 'pending'
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
