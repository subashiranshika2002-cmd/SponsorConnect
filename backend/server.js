const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const User = require("./models/User");
const requestRoutes = require("./routes/requestRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);
app.get("/", (_req, res) => {
  res.json({
    message: "SponsorConnect API is running"
  });
});

app.use((error, _req, res, _next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Invalid JSON request body"
    });
  }

  if (error.status === 413) {
    return res.status(413).json({
      message: "Request body is too large"
    });
  }

  console.error("Request failed:", error.name);

  return res.status(500).json({
    message: "Server error"
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from .env");
    }

    await connectDB();

    // Wait for the unique email index before accepting registrations.
    await User.init();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on("error", async (error) => {
      console.error("Server failed:", error.message);
      await mongoose.disconnect();
      process.exitCode = 1;
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    await mongoose.disconnect();
    process.exitCode = 1;
  }
}

startServer();