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

      // Store relative path to the uploaded file
      const pdfUrl = `/uploads/articles/${req.file.filename}`;

      const newArticle = await Article.create({
        title,
        summary,
        pdfUrl,
        conferenceId,
        authorId,
        status: "IN_REVIEW",
        currentVersion: 1,
        versions: [{ v: 1, date: new Date().toISOString() }],
        reviewer1Id: selectedReviewers[0] || null,
        reviewer2Id: selectedReviewers[1] || null,
      });

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

      const article = await Article.findByPk(id);

      if (!article) {
        return res.status(404).json({
          status: "error",
          message: "Article not found.",
        });
      }

      // Build absolute path to the PDF file
      const filePath = path.join(__dirname, "../../", article.pdfUrl);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          status: "error",
          message: "PDF file not found.",
        });
      }

      // Set appropriate headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${article.title}.pdf"`
      );

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
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

      // Store the old PDF path for version history
      const oldPdfUrl = article.pdfUrl;
      const newVersion = article.currentVersion + 1;
      const newPdfUrl = `/uploads/articles/${req.file.filename}`;

      // Update versions history
      const updatedVersions = [
        ...article.versions,
        {
          v: article.currentVersion,
          date: article.updatedAt,
          pdfUrl: oldPdfUrl,
        },
      ];

      // Update article
      article.title = title || article.title;
      article.summary = summary || article.summary;
      article.pdfUrl = newPdfUrl;
      article.currentVersion = newVersion;
      article.versions = updatedVersions;
      article.status = "IN_REVIEW"; // Reset to IN_REVIEW after update

      await article.save();

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
};

export default articleController;
