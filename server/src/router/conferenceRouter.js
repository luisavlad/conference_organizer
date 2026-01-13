import express from "express";
import conferenceController from "../controllers/conferenceController.js";

const conferenceRouter = express.Router();

conferenceRouter.route("/").get(conferenceController.getAllConferences);

export default conferenceRouter;
