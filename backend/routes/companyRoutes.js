const express = require("express");
const {
  getCompanies,
  createCompany
} = require("../controllers/companyController");

const {
  requireAuth,
  requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCompanies);

router.post("/", requireAuth, requireAdmin, createCompany);

module.exports = router;