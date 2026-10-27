const express = require("express");
const OpenAI = require("openai");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Only signed-in users can request a draft.
router.post("/draft", requireAuth, async (req, res) => {
  const instruction = req.body?.instruction;

  if (
    typeof instruction !== "string" ||
    !instruction.trim() ||
    instruction.length > 1000
  ) {
    return res.status(400).json({
      message: "Enter an instruction between 1 and 1000 characters."
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      message: "The AI writing assistant is not configured."
    });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000,
      maxRetries: 0
    });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      instructions:
        "Write a polite, concise sponsorship conversation message based on the user's request. " +
        "Return only the message. Do not invent names, contact details, or commitments.",
      input: instruction.trim(),
      max_output_tokens: 400
    });

    const draft = response.output_text?.trim();

    if (!draft) {
      return res.status(502).json({
        message: "The AI did not return a draft. Please try again."
      });
    }

    return res.json({
      draft: draft.slice(0, 2000)
    });
  } catch (error) {
    // Show the error category and status without printing the API key.
    console.error("AI draft failed:", {
      name: error.name,
      status: error.status,
      code: error.code
    });

    return res.status(502).json({
      message:
        "Could not generate a draft. Check your AI configuration and try again."
    });
  }
});

module.exports = router;