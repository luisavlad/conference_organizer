import database from "../core/database.js";
import { DataTypes } from "sequelize";

const Article = database.define("Article", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pdfUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  summary: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM(
      "IN_REVIEW",
      "REVISION_REQUIRED",
      "ACCEPTED",
      "REJECTED"
    ),
    allowNull: false,
    defaultValue: "IN_REVIEW",
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  conferenceId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  currentVersion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  versions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
});

export default Article;
