const Company = require("../models/Company");

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

async function createCompany(req, res, next) {
  try {
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

    const company = await Company.create(companyData);

    return res.status(201).json({
      message: "Company added successfully",
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

module.exports = { getCompanies, createCompany };