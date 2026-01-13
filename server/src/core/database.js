import path from "node:path";
import { Sequelize } from "sequelize";

const dbPath = path.join(process.cwd(), "database.db");

const database = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
});

export default database;
