import path from "node:path";
import { Sequelize } from "sequelize";

const dbPath = path.join(process.cwd(), "database.db");

const database = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    })
  : new Sequelize({
      dialect: "sqlite",
      storage: dbPath,
      logging: false,
    });

export default database;
