const express = require("express");
const mongoose = require("mongoose");
const Message = require("../models/Message");
const SponsorshipRequest = require("../models/SponsorshipRequest");
const { requireAuth } = require("../middleware/authMiddleware");


const router = express.Router();

router.use(requireAuth);

// Each account can access only its own conversations.
function conversationFilter(user) {
  if (user.role === "company") {
    return user.company ? { company: user.company } : null;
  }

  if (["user", "admin"].includes(user.role)) {
    return { organizer: user._id };
  }

  return null;
}

// List sponsorship requests available for conversation.
router.get("/conversations", async (req, res, next) => {
  try {
    const filter = conversationFilter(req.user);

    if (!filter) {
      return res.json({ conversations: [] });
    }

    const conversations = await SponsorshipRequest.find(filter)
      .select("eventName company organizer status createdAt")
      .populate("company", "name")
      .populate("organizer", "full_name")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ conversations });
  } catch (error) {
    next(error);
  }
});

// Check permission before reading or sending messages.
async function requireConversation(req, res, next) {
  try {
    const filter = conversationFilter(req.user);

    if (!mongoose.isValidObjectId(req.params.requestId)) {
      return res.status(400).json({
        message: "Invalid request ID",
      });
    }

    if (!filter) {
      return res.status(403).json({
        message: "Your account has no company assigned.",
      });
    }

    const request = await SponsorshipRequest.findOne({
      ...filter,
      _id: req.params.requestId,
    }).select("_id");

    if (!request) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

// Read the latest 100 messages.
router.get("/:requestId", requireConversation, async (req, res, next) => {
  try {
    const messages = await Message.find({
      request: req.params.requestId,
    })
      .populate("sender", "full_name")
      .sort({ createdAt: -1, _id: -1 })
      .limit(100)
      .lean();

    res.json({ messages: messages.reverse() });
  } catch (error) {
    next(error);
  }
});

// Send a message.
router.post("/:requestId", requireConversation, async (req, res, next) => {
  try {
    const text = req.body?.text;

    if (
      typeof text !== "string" ||
      !text.trim() ||
      text.length > 2000
    ) {
      return res.status(400).json({
        message: "Enter a message between 1 and 2000 characters.",
      });
    }

    const message = await Message.create({
      request: req.params.requestId,
      sender: req.user._id,
      text: text.trim(),
    });

    await message.populate("sender", "full_name");

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
});

module.exports = router;