const router = require("express").Router();
const { Conference, User } = require("../models");

// GET /api/conferences
router.get("/conferences", async (req, res, next) => {
  try {
    const list = await Conference.findAll({ order: [["createdAt", "DESC"]] });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// POST /api/conferences
router.post("/conferences", async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      startDate,
      endDate,
      submissionStart,
      submissionEnd,
      createdBy,
      reviewerIds,
    } = req.body;

    if (!title || !startDate || !endDate || !createdBy) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const conference = await Conference.create({
      title,
      description,
      location,
      startDate,
      endDate,
      submissionStart,
      submissionEnd,
      createdBy,
      reviewerIds: reviewerIds || [],
    });

    res.status(201).json(conference);
  } catch (e) {
    next(e);
  }
});

// GET /api/conferences/:id
router.get("/conferences/:id", async (req, res, next) => {
  try {
    const conference = await Conference.findByPk(req.params.id);
    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }

    // Get reviewers if reviewerIds exist
    let reviewers = [];
    if (conference.reviewerIds && conference.reviewerIds.length > 0) {
      reviewers = await User.findAll({
        where: { id: conference.reviewerIds },
        attributes: ["id", "name", "email", "role"],
      });
    }

    res.json({
      ...conference.toJSON(),
      reviewers,
    });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/conferences/:id
router.patch("/conferences/:id", async (req, res, next) => {
  try {
    const conference = await Conference.findByPk(req.params.id);
    if (!conference) {
      return res.status(404).json({ error: "Conference not found" });
    }

    const {
      title,
      description,
      location,
      startDate,
      endDate,
      submissionStart,
      submissionEnd,
      reviewerIds,
    } = req.body;

    if (title !== undefined) conference.title = title;
    if (description !== undefined) conference.description = description;
    if (location !== undefined) conference.location = location;
    if (startDate !== undefined) conference.startDate = startDate;
    if (endDate !== undefined) conference.endDate = endDate;
    if (submissionStart !== undefined)
      conference.submissionStart = submissionStart;
    if (submissionEnd !== undefined) conference.submissionEnd = submissionEnd;
    if (reviewerIds !== undefined) conference.reviewerIds = reviewerIds;

    await conference.save();
    res.json(conference);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
