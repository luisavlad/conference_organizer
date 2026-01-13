const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.post("/reviews/:reviewId/comments", commentController.createComment);
router.get(
  "/reviews/:reviewId/comments",
  commentController.getCommentsByReview
);
router.delete("/comments/:id", commentController.deleteComment);

module.exports = router;
