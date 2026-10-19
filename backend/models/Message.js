const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SponsorshipRequest",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);