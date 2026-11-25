const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");

const Company = require("../../models/Company");
const SponsorshipRequest = require("../../models/SponsorshipRequest");
const User = require("../../models/User");

const {
  deleteCompany
} = require("../../controllers/companyController");

const validId = "507f1f77bcf86cd799439011";

Before(function () {
  this.originalMethods = {
    findOne: Company.findOne,
    findOneAndDelete: Company.findOneAndDelete,
    requestExists: SponsorshipRequest.exists,
    userExists: User.exists
  };

  this.req = {
    user: {},
    params: { id: validId }
  };

  this.statusCode = 200;
  this.responseBody = null;
  this.error = null;
  this.deleteCalled = false;

  const world = this;

  this.res = {
    status(code) {
      world.statusCode = code;
      return this;
    },

    json(data) {
      world.responseBody = data;
      return this;
    }
  };

  this.next = (error) => {
    world.error = error;
  };

  // Mock database operations.
  Company.findOne = async () => null;
  SponsorshipRequest.exists = async () => null;
  User.exists = async () => null;

  Company.findOneAndDelete = async () => {
    world.deleteCalled = true;
    return { _id: validId };
  };
});

Given("the user is an administrator", function () {
  this.req.user.role = "admin";
});

Given("the company exists without linked records", function () {
  Company.findOne = async () => ({
    _id: validId,
    isActive: true
  });

  SponsorshipRequest.exists = async () => null;
  User.exists = async () => null;
});

Given("the user is a normal user", function () {
  this.req.user.role = "user";
});

When("the user attempts to delete the company", async function () {
  await deleteCompany(this.req, this.res, this.next);
});

Then("the deletion should be successful", function () {
  assert.equal(this.error, null);
  assert.equal(this.statusCode, 200);
  assert.equal(this.deleteCalled, true);

  assert.equal(
    this.responseBody.message,
    "Company deleted successfully"
  );
});

Then("the response status should be {int}", function (status) {
  assert.equal(this.error, null);
  assert.equal(this.statusCode, status);
  assert.equal(this.deleteCalled, false);

  assert.equal(
    this.responseBody.message,
    "Only admins can delete companies"
  );
});

After(function () {
  // Restore original database methods.
  Company.findOne = this.originalMethods.findOne;

  Company.findOneAndDelete =
    this.originalMethods.findOneAndDelete;

  SponsorshipRequest.exists =
    this.originalMethods.requestExists;

  User.exists = this.originalMethods.userExists;
});