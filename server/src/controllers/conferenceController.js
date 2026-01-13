import { Conference } from "../models/index.js";

const conferenceController = {
  getAllConferences: async (req, res) => {
    try {
      const conferences = await Conference.findAll();

      res.status(200).json({
        status: "success",
        results: conferences.length,
        data: {
          conferences,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve conferences.",
      });
    }
  },

  createConference: async (req, res) => {
    try {
      const { title, description, location, startDate, endDate, reviewers } =
        req.body;

      const newConference = await Conference.create({
        title,
        description,
        location,
        startDate,
        endDate,
        reviewer1: reviewers[0] || null,
        reviewer2: reviewers[1] || null,
        reviewer3: reviewers[2] || null,
        articles: [],
      });

      res.status(201).json({
        status: "success",
        data: {
          conference: newConference,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Failed to create conference.",
      });
    }
  },
};

export default conferenceController;
