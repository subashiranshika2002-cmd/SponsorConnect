const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    eventDate: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    expectedAudience: {
      type: Number,
      required: true,
      min: 1,
      max: 10000000
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    requestedSupport: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    sponsorBenefits: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    proposalName: {
  type: String,
  default: ""
},
proposalData: {
  type: Buffer,
  select: false
},
    status: {
      type: String,
      enum: ["Submitted", "Under review", "Accepted", "Rejected"],
      default: "Submitted"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SponsorshipRequest", requestSchema);