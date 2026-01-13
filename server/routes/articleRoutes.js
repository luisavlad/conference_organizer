const router = require("express").Router();
const { saveBase64Pdf } = require("../utils/fileStorage");

const { Article, Review, Conference, User } = require("../models");

// POST /api/conferences/:confId/articles
router.post("/conferences/:confId/articles", async (req, res, next) => {
  try {
    const { title, summary, pdfBase64, fileName, authorId } = req.body;
    if (!title || !pdfBase64 || !authorId) {
      return res
        .status(400)
        .json({ error: "title, pdfBase64, and authorId are required" });
    }

    const conference = await Conference.findByPk(req.params.confId, {
      include: [{ model: User, as: "reviewers" }],
    });

    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }

    if (!conference.reviewers || conference.reviewers.length < 2) {
      return res
        .status(400)
        .json({ error: "Conference must have at least 2 reviewers" });
    }

    const saved = saveBase64Pdf(pdfBase64, fileName);

    const article = await Article.create({
      title,
      summary,
      pdfUrl: saved.pdfUrl,
      status: "IN_REVIEW",
      authorId,
      conferenceId: conference.id,
      currentVersion: 1,
      versions: [
        {
          versionNumber: 1,
          pdfUrl: saved.pdfUrl,
          pdfPath: saved.pdfPath,
          submittedAt: new Date().toISOString(),
        },
      ],
    });

    const selectedReviewers = conference.reviewers.slice(0, 2);

    for (const reviewer of selectedReviewers) {
      await Review.create({
        articleId: article.id,
        reviewerId: reviewer.id,
        decision: "revision_required",
      });
    }

    res.status(201).json({
      message: "Article submitted successfully",
      articleId: article.id,
    });
  } catch (e) {
    next(e);
  }
});

// POST /api/articles/:articleId/versions
router.post("/articles/:articleId/versions", async (req, res, next) => {
  try {
    const { pdfBase64, fileName } = req.body;
    if (!pdfBase64)
      return res.status(400).json({ error: "pdfBase64 required" });

    const article = await Article.findByPk(req.params.articleId);
    if (!article) return res.status(404).json({ error: "Article not found" });

    const saved = saveBase64Pdf(pdfBase64, fileName);
    const newVersion = article.currentVersion + 1;

    const updatedVersions = [
      ...article.versions,
      {
        versionNumber: newVersion,
        pdfUrl: saved.pdfUrl,
        pdfPath: saved.pdfPath,
        submittedAt: new Date().toISOString(),
      },
    ];

    await article.update({
      currentVersion: newVersion,
      pdfUrl: saved.pdfUrl,
      versions: updatedVersions,
      status: "IN_REVIEW",
    });

    await Review.update(
      { decision: "revision_required" },
      { where: { articleId: article.id } }
    );

    res.json({ ok: true, currentVersion: newVersion });
  } catch (e) {
    next(e);
  }
});

// GET /api/conferences/:confId/articles
router.get("/conferences/:confId/articles", async (req, res, next) => {
  try {
    const conference = await Conference.findByPk(req.params.confId);
    if (!conference)
      return res.status(404).json({ error: "Conference not found" });

    const articles = await Article.findAll({
      where: { conferenceId: req.params.confId },
      attributes: [
        "id",
        "title",
        "status",
        "currentVersion",
        "createdAt",
        "updatedAt",
      ],
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Review, attributes: ["id", "reviewerId", "decision"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(
      articles.map((a) => ({
        id: a.id,
        title: a.title,
        status: a.status,
        currentVersion: a.currentVersion,
        author: a.User
          ? { id: a.User.id, name: a.User.name, email: a.User.email }
          : null,
        reviews: (a.Reviews || []).map((r) => ({
          id: r.id,
          reviewerId: r.reviewerId,
          decision: r.decision,
        })),
        updatedAt: a.updatedAt,
      }))
    );
  } catch (e) {
    next(e);
  }
});

// GET /api/articles?authorId=xxx
router.get("/articles", async (req, res, next) => {
  try {
    const { authorId } = req.query;
    const where = authorId ? { authorId } : {};

    const articles = await Article.findAll({
      where,
      attributes: [
        "id",
        "title",
        "status",
        "currentVersion",
        "conferenceId",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Conference,
          attributes: ["id", "title"],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    res.json(
      articles.map((a) => ({
        id: a.id,
        title: a.title,
        status: a.status,
        currentVersion: a.currentVersion,
        conference: a.Conference
          ? { id: a.Conference.id, title: a.Conference.title }
          : null,
        updatedAt: a.updatedAt,
      }))
    );
  } catch (e) {
    next(e);
  }
});

module.exports = router;
