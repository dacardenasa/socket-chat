const mongoose = require("mongoose");

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Database connection established");
  } catch (err) {
    throw new Error("Error starting database connection: " + err);
  }
}

module.exports = {
  connectMongoDB
};
