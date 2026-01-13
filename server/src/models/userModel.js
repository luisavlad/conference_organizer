import database from "../core/database.js";
import { DataTypes } from "sequelize";

const User = database.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM("AUTHOR", "REVIEWER", "ORGANIZER"),
    allowNull: false,
  },
});

export default User;
