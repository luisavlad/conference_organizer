import express from "express";
import articleController from "../controllers/articleController.js";
import upload from "../config/multerConfig.js";

const articleRouter = express.Router();

articleRouter
  .route("/conference/:conferenceId")
  .get(articleController.getByConferenceId);

articleRouter.route("/").post(upload.single("pdf"), articleController.create);

articleRouter.route("/:id").get(articleController.getById);

articleRouter
  .route("/:id")
  .patch(upload.single("pdf"), articleController.update);

articleRouter.route("/:id/status").patch(articleController.updateStatus);

articleRouter.route("/:id/pdf").get(articleController.getPdf);

export default articleRouter;
