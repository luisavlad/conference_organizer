import express from "express";
import userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/reviewers").get(userController.getAllReviewers);

export default userRouter;
