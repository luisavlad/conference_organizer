const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const { articleId } = req.params;
    const reviewerId = req.user.userId;

    const review = await Review.create({
      articleId,
      reviewerId,
      decision: 'PENDING'
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
