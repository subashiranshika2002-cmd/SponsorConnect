const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

async function makeAdmin() {
  try {
    const email = process.argv[2]?.trim().toLowerCase();

    if (!email) {
      console.log(
        'Usage: node scripts/makeAdmin.js "your-email@example.com"'
      );
      process.exitCode = 1;
      return;
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { role: "admin" } },
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      console.log(
        "Account not found. Register this email in the application first."
      );
      process.exitCode = 1;
      return;
    }

    console.log(`Admin role assigned to ${user.full_name}.`);
  } catch (error) {
    console.error("Could not update the account:", error.name);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

makeAdmin();