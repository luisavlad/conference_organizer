import app from "./app.js";
import database from "./database.js";

const PORT = process.env.PORT || 8080;

async function initDb() {
  try {
    // Only run PRAGMA commands for SQLite, not PostgreSQL
    if (!process.env.DATABASE_URL) {
      await database.query("PRAGMA foreign_keys = OFF");
    }

    await database.sync();
    console.log("All models were successfully synchronized");

    if (!process.env.DATABASE_URL) {
      await database.query("PRAGMA foreign_keys = ON");
    }

    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}...`);
    });
  } catch (err) {
    console.error("Database sync failed:", err);
  }
}

initDb();
