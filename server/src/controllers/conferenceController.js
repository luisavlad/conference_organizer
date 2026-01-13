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
};

export default conferenceController;
