const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "database", "database.db"),
});

sequelize.sync({ alter: true }).then(() => {
  console.log("All models were synchronized successfully");
});

module.exports = sequelize;