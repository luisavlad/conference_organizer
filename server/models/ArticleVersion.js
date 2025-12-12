const { DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");

const ArticleVersion = sequelize.define(
  'ArticleVersion',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    articleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    versionNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pdfPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ArticleVersion;
