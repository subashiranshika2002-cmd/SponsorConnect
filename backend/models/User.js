const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "company", "admin"],
      default: "user",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);