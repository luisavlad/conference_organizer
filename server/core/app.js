const express = require("express");
const sequelize = require("../config/sequelize");
const path = require("path");

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// routes
const userRoutes = require("../routes/userRoutes");
app.use("/api/users", userRoutes);

const commentRoutes = require("../routes/commentRoutes");
app.use("/api", commentRoutes);

const reviewRoutes = require("../routes/reviewRoutes");
app.use("/api", reviewRoutes);

const demoRoutes = require("../routes/demo");
app.use("/api/demo", demoRoutes);

const conferenceRoutes = require("../routes/conferenceRoutes");
app.use("/api", conferenceRoutes);

const articleRoutes = require("../routes/articleRoutes");
app.use("/api", articleRoutes);

// Register models + relationships
require("../models");

sequelize
  .sync()
  .then(() => console.log("DB synced"))
  .catch((err) => console.error("DB sync error", err));

module.exports = app;
