const { DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");


const Review = sequelize.define(
  'Review',
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
    reviewerId: {
      type: DataTypes.UUID, 
      allowNull: false,
    },
    decision: {
      type: DataTypes.ENUM('accept', 'reject', 'revision_required'),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Review;
