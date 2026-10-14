const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const proposalUpload = require("../middleware/proposalUpload");

const {
  createRequest,
  getMyRequests,
  downloadProposal
} = require("../controllers/requestController");

const router = express.Router();

router.use(requireAuth);

router.get("/mine", getMyRequests);
router.get("/:id/proposal", downloadProposal);
router.post("/", proposalUpload, createRequest);

module.exports = router;