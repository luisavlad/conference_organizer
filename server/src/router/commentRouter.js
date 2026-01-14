import express from "express";
import commentController from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter
  .route("/article/:articleId")
  .get(commentController.getByArticleId);

commentRouter.route("/").post(commentController.create);

export default commentRouter;
