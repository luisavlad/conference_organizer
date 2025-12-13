const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const commentController = require("../controllers/commentControllers");

router.post(
  "/reviews/:reviewId/comments",
  auth,
  commentController.createComment
);

router.get(
  "/reviews/:reviewId/comments",
  auth,
  commentController.getCommentsByReview
);

router.delete(
  "/comments/:id",
  auth,
  commentController.deleteComment
);

module.exports = router;
