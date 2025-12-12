const express = require("express");
const sequelize = require("../config/sequelize");


const app = express();
app.use(express.json());

// routes
const userRoutes = require("../routes/user");
app.use("/api/users", userRoutes);

const commentRoutes = require("../routes/comment");
app.use("/api", commentRoutes);

const reviewRoutes = require('../routes/review');
app.use('/api', reviewRoutes);


// înregistrează modelele + relațiile
require("../models");

sequelize
  .sync()
  .then(() => console.log("DB synced"))
  .catch((err) => console.error("DB sync error", err));

module.exports = app;
