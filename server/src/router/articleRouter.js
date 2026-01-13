import express from "express";
import articleController from "../controllers/articleController.js";

const articleRouter = express.Router();

articleRouter
  .route("/conference/:conferenceId")
  .get(articleController.getByConferenceId);

export default articleRouter;
