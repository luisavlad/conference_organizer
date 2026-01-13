const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Article = sequelize.define(
  "Article",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
    },
    pdfUrl: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    tableName: "articles",
    timestamps: true,
  }
);

module.exports = Article;
