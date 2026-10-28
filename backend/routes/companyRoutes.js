const express = require("express");

const {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany
} = require("../controllers/companyController");

const {
  requireAuth,
  requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCompanies);

// Only admins can add companies.
router.post("/", requireAuth, requireAdmin, createCompany);

// FIX: Ownership is checked inside updateCompany.
router.put("/:id", requireAuth, updateCompany);

// Only admins can delete companies.
router.delete("/:id", requireAuth, requireAdmin, deleteCompany);

module.exports = router;