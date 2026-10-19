const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.db.admin().ping();

    console.log("MongoDB Atlas connected successfully!");
    console.log("Database:", mongoose.connection.name);
  } catch (error) {
    console.error("Connection failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();