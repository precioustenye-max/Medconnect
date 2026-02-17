const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT
  }
);

const connectDB = async () => {
  try {
    
    await sequelize.authenticate();
    console.log("MySQL connected successfully");
  } catch (error) {
    const code = error?.original?.code || error?.parent?.code || "UNKNOWN";
    const message =
      error?.original?.sqlMessage ||
      error?.original?.message ||
      error?.message ||
      "Unknown database error";
    console.error(`MySQL connection failed [${code}]: ${message}`);
    throw error;
  }
};

module.exports = { sequelize, connectDB };
