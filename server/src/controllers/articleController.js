import { Article } from "../models/index.js";

const articleController = {
  getByConferenceId: async (req, res) => {
    try {
      const { conferenceId } = req.params;

      const articles = await Article.findAll({
        where: {
          conferenceId: conferenceId,
        },
      });

      res.status(200).json({
        status: "success",
        results: articles.length,
        data: {
          articles,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve articles.",
      });
    }
  },
};

export default articleController;
