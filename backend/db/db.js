const mongoose = require("mongoose");
require("dotenv").config();

const dbURL = process.env.MONGO_URL;

function connectDB() {
  return mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to database");
    })
    .catch((error) => {
      console.log("Database connection error:", error);
      process.exit(1); // Exit process if DB connection fails
    });
}

module.exports = {
  connectDB,
};
