import { Comment, User } from "../models/index.js";

const commentController = {
  // ---------------------------------------------------------
  // Retrieve all comments for a specific article
  // ---------------------------------------------------------
  getByArticleId: async (req, res) => {
    try {
      const { articleId } = req.params;

      const comments = await Comment.findAll({
        where: {
          articleId: articleId,
        },
        include: [
          {
            model: User,
            attributes: ["id", "name", "email", "role"],
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      res.status(200).json({
        status: "success",
        results: comments.length,
        data: {
          comments,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve comments.",
      });
    }
  },

  // ---------------------------------------------------------
  // Create a new comment on an article
  // ---------------------------------------------------------
  create: async (req, res) => {
    try {
      const { text, isPublic, articleId, userId } = req.body;

      if (!text || !articleId || !userId) {
        return res.status(400).json({
          status: "error",
          message: "Missing required fields: text, articleId, userId.",
        });
      }

      const newComment = await Comment.create({
        text,
        isPublic: isPublic !== undefined ? isPublic : true,
        articleId,
        userId,
      });

      res.status(201).json({
        status: "success",
        data: {
          comment: newComment,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Failed to create comment.",
      });
    }
  },
};

export default commentController;
