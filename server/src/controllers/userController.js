import { User } from "../models/index.js";

const userController = {
  // ---------------------------------------------------------
  // Retrieve all users with reviewer role
  // ---------------------------------------------------------
  getAllReviewers: async (req, res) => {
    try {
      const reviewers = await User.findAll({
        where: {
          role: "REVIEWER",
        },
      });

      res.status(200).json({
        status: "success",
        results: reviewers.length,
        data: {
          reviewers,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve reviewers.",
      });
    }
  },
};

export default userController;
