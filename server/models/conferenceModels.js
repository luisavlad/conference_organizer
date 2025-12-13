const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Conference = sequelize.define(
  "Conference",
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      len: [1, 500],
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [1, 100],
    },
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    submissionStart: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    submissionEnd: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Conference;