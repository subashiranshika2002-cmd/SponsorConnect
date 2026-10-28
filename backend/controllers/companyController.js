const mongoose = require("mongoose");
const Company = require("../models/Company");
const SponsorshipRequest = require("../models/SponsorshipRequest");
const User = require("../models/User");

async function getCompanies(_req, res, next) {
  try {
    const companies = await Company.find({ isActive: true })
      .select(
        "name description email phone website address sponsorshipInterests"
      )
      .sort({ name: 1 })
      .lean();

    return res.json({ companies });
  } catch (error) {
    next(error);
  }
}

async function saveCompany(req, res, next, isUpdate) {
  try {
    if (isUpdate && !mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    const body = req.body || {};
    const companyData = {};

    const limits = {
      name: 150,
      description: 2000,
      email: 254,
      phone: 40,
      website: 500,
      address: 500
    };

    for (const [field, maxLength] of Object.entries(limits)) {
      const value = body[field] ?? "";

      if (typeof value !== "string" || value.length > maxLength) {
        return res.status(400).json({
          message: `Please enter a valid ${field}`
        });
      }

      companyData[field] = value.trim();
    }

    if (!companyData.name || !companyData.email) {
      return res.status(400).json({
        message: "Company name and email are required"
      });
    }

    companyData.email = companyData.email.toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyData.email)) {
      return res.status(400).json({
        message: "Please enter a valid company email"
      });
    }

    if (companyData.website) {
      try {
        const url = new URL(companyData.website);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid website");
        }
      } catch {
        return res.status(400).json({
          message: "Website must start with https:// or http://"
        });
      }
    }

    const company = isUpdate
      ? await Company.findOneAndUpdate(
          { _id: req.params.id, isActive: true },
          { $set: companyData },
          { new: true, runValidators: true }
        )
      : await Company.create(companyData);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(isUpdate ? 200 : 201).json({
      message: isUpdate ? "Company updated successfully" : "Company added successfully",
      company
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Please check the company details"
      });
    }

    next(error);
  }
}

function createCompany(req, res, next) {
  return saveCompany(req, res, next, false);
}
function updateCompany(req, res, next) {
  const companyId = req.params.id;

  // FIX: Reject invalid IDs before checking ownership.
  if (!mongoose.isValidObjectId(companyId)) {
    return res.status(400).json({
      message: "Invalid company ID"
    });
  }

  const isAdmin = req.user?.role === "admin";

  // FIX: Use the company assigned to the authenticated database user.
  const assignedCompanyId =
    req.user?.company?._id || req.user?.company;

  const isOwnCompany =
    req.user?.role === "company" &&
    assignedCompanyId &&
    String(assignedCompanyId).toLowerCase() ===
      companyId.toLowerCase();

  if (!isAdmin && !isOwnCompany) {
    return res.status(403).json({
      message: "You can edit only your assigned company."
    });
  }

  return saveCompany(req, res, next, true);
}
// FIX: Restore company deletion and protect linked records.
async function deleteCompany(req, res, next) {
  try {
    // Only admins can delete companies.
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can delete companies"
      });
    }

    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid company ID"
      });
    }

    const company = await Company.findOne({
      _id: id,
      isActive: true
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    // Preserve companies referenced by proposals or user accounts.
    const [hasRequests, hasUsers] = await Promise.all([
      SponsorshipRequest.exists({ company: id }),
      User.exists({ company: id })
    ]);

    if (hasRequests || hasUsers) {
      return res.status(409).json({
        message:
          "Cannot delete this company because it has linked sponsorship requests or user accounts."
      });
    }

    const deletedCompany = await Company.findOneAndDelete({
      _id: id,
      isActive: true
    });

    if (!deletedCompany) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    return res.json({
      message: "Company deleted successfully"
    });
  } catch (error) {
    return next(error);
  }
}
module.exports = {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany
};