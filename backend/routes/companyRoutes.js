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

router.post("/", requireAuth, requireAdmin, createCompany);
router.put("/:id", requireAuth, requireAdmin, updateCompany);
router.delete("/:id", requireAuth, requireAdmin, deleteCompany);

module.exports = router;
