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
    allowNull: true,
  },
  pdfData: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  pdfMimeType: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'application/pdf',
  },
  pdfFilename: {
    type: DataTypes.STRING,
    allowNull: true,
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
  reviewer1Id: {
    type: DataTypes.UUID,
  },
  reviewer2Id: {
    type: DataTypes.UUID,
  },
});

export default Article;
