import { Article, Conference, User } from "../models/index.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  create: async (req, res) => {
    try {
      console.log("Request body:", req.body);
      console.log("Request file:", req.file);

      const { title, summary, conferenceId, authorId } = req.body;

      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "PDF file is required.",
        });
      }

      // Fetch conference to get reviewers
      const conference = await Conference.findByPk(conferenceId);
      if (!conference) {
        return res.status(404).json({
          status: "error",
          message: "Conference not found.",
        });
      }

      // Get all reviewers from conference
      const reviewers = [
        conference.reviewer1,
        conference.reviewer2,
        conference.reviewer3,
      ].filter((r) => r !== null && r !== undefined);

      // Randomly select 2 reviewers
      let selectedReviewers = [];
      if (reviewers.length >= 2) {
        const shuffled = [...reviewers].sort(() => Math.random() - 0.5);
        selectedReviewers = shuffled.slice(0, 2);
      }

      // Read PDF file as binary data
      const pdfData = fs.readFileSync(req.file.path);

      const newArticle = await Article.create({
        title,
        summary,
        pdfData: pdfData,
        pdfMimeType: req.file.mimetype,
        pdfFilename: req.file.originalname,
        conferenceId,
        authorId,
        status: "IN_REVIEW",
        currentVersion: 1,
        versions: [{ v: 1, date: new Date().toISOString() }],
        reviewer1Id: selectedReviewers[0] || null,
        reviewer2Id: selectedReviewers[1] || null,
      });

      // Delete uploaded file after saving to database
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error("Failed to delete temporary file:", unlinkErr);
      }

      res.status(201).json({
        status: "success",
        data: {
          article: newArticle,
        },
      });
    } catch (err) {
      console.error("Article creation error:", err);
      // Delete uploaded file if article creation fails
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
          console.error("Failed to delete file:", unlinkErr);
        }
      }
      res.status(500).json({
        status: "error",
        message: "Failed to create article.",
        error: err.message,
      });
    }
  },

  getPdf: async (req, res) => {
    try {
      const { id } = req.params;

      const article = await Article.findByPk(id, {
        attributes: ['id', 'pdfData', 'pdfMimeType', 'pdfFilename', 'title']
      });

      if (!article) {
        return res.status(404).json({
          status: "error",
          message: "Article not found.",
        });
      }

      if (!article.pdfData) {
        return res.status(404).json({
          status: "error",
          message: "PDF file not found.",
        });
      }

      // Set appropriate headers
      res.setHeader("Content-Type", article.pdfMimeType || "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${article.pdfFilename || article.title + '.pdf'}"`
      );

      // Send the binary PDF data
      res.send(article.pdfData);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve PDF.",
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const article = await Article.findByPk(id);

      if (!article) {
        return res.status(404).json({
          status: "error",
          message: "Article not found.",
        });
      }

      // Fetch reviewer information
      const reviewers = [];
      if (article.reviewer1Id) {
        const reviewer1 = await User.findByPk(article.reviewer1Id, {
          attributes: ["id", "name", "email"],
        });
        if (reviewer1) reviewers.push(reviewer1);
      }
      if (article.reviewer2Id) {
        const reviewer2 = await User.findByPk(article.reviewer2Id, {
          attributes: ["id", "name", "email"],
        });
        if (reviewer2) reviewers.push(reviewer2);
      }

      res.status(200).json({
        status: "success",
        data: {
          article: {
            ...article.toJSON(),
            reviewers,
          },
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve article.",
      });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = [
        "IN_REVIEW",
        "REVISION_REQUIRED",
        "ACCEPTED",
        "REJECTED",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid status value.",
        });
      }

      const article = await Article.findByPk(id);

      if (!article) {
        return res.status(404).json({
          status: "error",
          message: "Article not found.",
        });
      }

      article.status = status;
      await article.save();

      res.status(200).json({
        status: "success",
        data: {
          article,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Failed to update article status.",
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, summary } = req.body;

      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "PDF file is required for article update.",
        });
      }

      const article = await Article.findByPk(id);

      if (!article) {
        return res.status(404).json({
          status: "error",
          message: "Article not found.",
        });
      }

      // Read new PDF file as binary data
      const pdfData = fs.readFileSync(req.file.path);
      const newVersion = article.currentVersion + 1;

      // Update versions history
      const updatedVersions = [
        ...article.versions,
        {
          v: article.currentVersion,
          date: article.updatedAt,
        },
      ];

      // Update article
      article.title = title || article.title;
      article.summary = summary || article.summary;
      article.pdfData = pdfData;
      article.pdfMimeType = req.file.mimetype;
      article.pdfFilename = req.file.originalname;
      article.currentVersion = newVersion;
      article.versions = updatedVersions;
      article.status = "IN_REVIEW"; // Reset to IN_REVIEW after update

      await article.save();

      // Delete uploaded file after saving to database
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error("Failed to delete temporary file:", unlinkErr);
      }

      res.status(200).json({
        status: "success",
        data: {
          article,
        },
      });
    } catch (err) {
      console.error("Article update error:", err);
      // Delete uploaded file if update fails
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
          console.error("Failed to delete file:", unlinkErr);
        }
      }
      res.status(500).json({
        status: "error",
        message: "Failed to update article.",
        error: err.message,
      });
    }
  },
    }
  },
};

export default articleController;
