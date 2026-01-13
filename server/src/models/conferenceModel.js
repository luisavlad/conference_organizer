import database from "../core/database.js";
import { DataTypes } from "sequelize";

const Conference = database.define("Conference", {
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
  description: {
    type: DataTypes.TEXT,
  },
  location: {
    type: DataTypes.STRING,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  reviewer1: {
    type: DataTypes.UUID,
  },
  reviewer2: {
    type: DataTypes.UUID,
  },
  reviewer3: {
    type: DataTypes.UUID,
  },
  articles: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
});

export default Conference;
