const mongoose = require("mongoose");
const Company = require("../models/Company");
const SponsorshipRequest = require("../models/SponsorshipRequest");
const { sendProposalEmail } = require("../services/emailService");

async function createRequest(req, res, next) {
  try {
    if (!["user", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only event organizers can submit requests",
      });
    }

    const body = req.body || {};

    if (
      typeof body.company !== "string" ||
      !mongoose.isValidObjectId(body.company)
    ) {
      return res.status(400).json({
        message: "Please select a company",
      });
    }

    const details = {};
    const limits = {
      eventName: 150,
      location: 300,
      description: 5000,
      requestedSupport: 2000,
      sponsorBenefits: 2000,
    };

    for (const [field, maximum] of Object.entries(limits)) {
      const value = body[field];

      if (
        typeof value !== "string" ||
        !value.trim() ||
        value.length > maximum
      ) {
        return res.status(400).json({
          message: `Please check ${field}`,
        });
      }

      details[field] = value.trim();
    }

    const audienceValue = body.expectedAudience;

    if (
      typeof audienceValue !== "number" &&
      (typeof audienceValue !== "string" ||
        !/^\d+$/.test(audienceValue))
    ) {
      return res.status(400).json({
        message: "Please enter a valid expected audience",
      });
    }

    const expectedAudience = Number(audienceValue);

    if (
      !Number.isInteger(expectedAudience) ||
      expectedAudience < 1 ||
      expectedAudience > 10000000
    ) {
      return res.status(400).json({
        message:
          "Expected audience must be a whole number from 1 to 10000000",
      });
    }

    if (
      typeof body.eventDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(body.eventDate)
    ) {
      return res.status(400).json({
        message: "Please enter a valid event date",
      });
    }

    const eventDate = new Date(`${body.eventDate}T00:00:00.000Z`);

    if (
      Number.isNaN(eventDate.getTime()) ||
      eventDate.toISOString().slice(0, 10) !== body.eventDate
    ) {
      return res.status(400).json({
        message: "Please enter a valid event date",
      });
    }

    const company = await Company.findOne({
      _id: body.company,
      isActive: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "This company is no longer available",
      });
    }

    // Save the request before attempting to send its email.
    const request = await SponsorshipRequest.create({
      ...details,
      expectedAudience,
      eventDate,
      company: company._id,
      organizer: req.user._id,
      ...(req.file
        ? {
            proposalName: req.file.originalname.slice(0, 200),
            proposalData: req.file.buffer,
          }
        : {}),
    });

    let emailSent = false;

    try {
      await sendProposalEmail({
        company,
        organizer: req.user,
        request,
        file: req.file,
      });

      emailSent = true;
    } catch (emailError) {
      console.error(
        "Proposal email failed:",
        emailError.code || emailError.name
      );
    }

    return res.status(201).json({
      message: emailSent
        ? "Your request was saved and an email notification was sent to the company."
        : "Your request was saved, but the email notification could not be sent. Do not submit the request again.",
      emailSent,
      request: {
        _id: request._id,
        status: request.status,
        proposalName: request.proposalName,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Please check your event details",
      });
    }

    next(error);
  }
}

async function getMyRequests(req, res, next) {
  try {
    const requests = await SponsorshipRequest.find({
      organizer: req.user._id,
    })
      .populate("company", "name")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ requests });
  } catch (error) {
    next(error);
  }
}

async function downloadProposal(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid request ID",
      });
    }

    const request = await SponsorshipRequest.findOne({
      _id: req.params.id,
      organizer: req.user._id,
    }).select("+proposalData");

    if (!request || !request.proposalData) {
      return res.status(404).json({
        message: "Proposal document not found",
      });
    }

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="proposal.pdf"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    });

    return res.send(request.proposalData);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createRequest,
  getMyRequests,
  downloadProposal,
};