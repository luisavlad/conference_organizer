const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post(
  '/articles/:articleId/reviews',
  auth,
  reviewController.createReview
);

module.exports = router;
