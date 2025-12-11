const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Article = sequelize.define(
  "Article",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [1, 100],
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: true,
      len: [1, 500],
    },
    pdfPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('under_review', 'revision_required', 'accepted', 'rejected'),
      defaultValue: 'under_review',
      allowNull: false,
    },
    authorId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    conferenceId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    currentVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    reviewerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Article;