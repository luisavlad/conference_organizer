import app from "./app.js";
import database from "./database.js";

const PORT = 8080;

async function initDb() {
  try {
    await database.query("PRAGMA foreign_keys = OFF");

    await database.sync();
    console.log("All models were successfully synchronized");

    await database.query("PRAGMA foreign_keys = ON");

    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}...`);
    });
  } catch (err) {
    console.error("Database sync failed:", err);
  }
}

initDb();
