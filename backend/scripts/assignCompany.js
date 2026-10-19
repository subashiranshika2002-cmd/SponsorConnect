const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Company = require("../models/Company");

async function assignCompany() {
  try {
    const email = process.argv[2]?.trim().toLowerCase();
    const companyId = process.argv[3];

    if (!email || !mongoose.isValidObjectId(companyId)) {
      console.log(
        'Usage: node scripts/assignCompany.js "user@email.com" "COMPANY_ID"'
      );
      return;
    }

    await connectDB();

    const company = await Company.findOne({
      _id: companyId,
      isActive: true,
    });

    if (!company) {
      console.log("Company not found or inactive.");
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("Account not found. Register this account first.");
      return;
    }

    if (user.role === "admin") {
      console.log(
        "Use a separate company account. Keep your admin account."
      );
      return;
    }

    user.role = "company";
    user.company = company._id;

    await user.save();

    console.log(
      `${user.full_name} is now a representative of ${company.name}.`
    );
  } catch (error) {
    console.error("Assignment failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

assignCompany();