const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

async function requireAuth(req, res, next) {
  const header = req.get("Authorization") || "";
  const match = header.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({
      message: "Please sign in first"
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"]
    });
  } catch {
    return res.status(401).json({
      message: "Your session has expired or is invalid. Sign in again."
    });
  }

  if (
    typeof decoded.user_id !== "string" ||
    !mongoose.isValidObjectId(decoded.user_id)
  ) {
    return res.status(401).json({
      message: "Invalid session"
    });
  }

  try {
    const user = await User.findById(decoded.user_id);

    if (!user) {
      return res.status(401).json({
        message: "Account not found"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Only admins can add companies"
    });
  }

  next();
}

module.exports = { requireAuth, requireAdmin };