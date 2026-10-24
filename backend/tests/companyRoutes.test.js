const { test, before, after, beforeEach, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const jwt = require("jsonwebtoken");
const Company = require("../models/Company");
const User = require("../models/User");
const SponsorshipRequest = require("../models/SponsorshipRequest");
const companyRoutes = require("../routes/companyRoutes");

const companyId = "507f1f77bcf86cd799439011";
const userId = "507f1f77bcf86cd799439012";
const details = { name: "Updated company", email: "contact@example.com" };
const originalSecret = process.env.JWT_SECRET;
let server;
let baseUrl;
let token;
let role;

before(async () => {
  process.env.JWT_SECRET = "company-routes-test-secret";
  token = jwt.sign({ user_id: userId }, process.env.JWT_SECRET);
  const app = express();
  app.use(express.json());
  app.use("/api/companies", companyRoutes);
  app.use((_error, _req, res, _next) => res.status(500).json({ message: "Server error" }));
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/companies`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;
});

beforeEach(() => {
  role = "admin";
  mock.method(User, "findById", async () => ({ _id: userId, role }));
  mock.method(Company, "findOne", async () => ({ _id: companyId, ...details }));
  mock.method(Company, "findOneAndUpdate", async (_filter, update) => ({
    _id: companyId, ...update.$set
  }));
  mock.method(Company, "create", async (data) => ({ _id: companyId, ...data }));
  mock.method(Company, "findOneAndDelete", async () => ({ _id: companyId }));
  mock.method(SponsorshipRequest, "exists", async () => null);
  mock.method(User, "exists", async () => null);
});

afterEach(() => mock.restoreAll());

function request(method, body, id = companyId, authenticated = true) {
  return fetch(`${baseUrl}${id ? `/${id}` : ""}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authenticated ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
}

test("edit and delete require authentication", async () => {
  for (const method of ["PUT", "DELETE"]) {
    const response = await request(method, undefined, companyId, false);
    assert.equal(response.status, 401);
  }
  assert.equal(Company.findOneAndUpdate.mock.callCount(), 0);
  assert.equal(Company.findOneAndDelete.mock.callCount(), 0);
});

test("organizers and company representatives cannot edit or delete", async () => {
  for (role of ["user", "company"]) {
    for (const method of ["PUT", "DELETE"]) {
      assert.equal((await request(method, details)).status, 403);
    }
  }
  assert.equal(Company.findOneAndUpdate.mock.callCount(), 0);
  assert.equal(Company.findOneAndDelete.mock.callCount(), 0);
});

test("admin edit normalizes details and excludes protected fields", async () => {
  const response = await request("PUT", {
    ...details, name: "  New name  ", email: " ADMIN@EXAMPLE.COM ",
    isActive: false, sponsorshipInterests: ["overwrite"]
  });
  assert.equal(response.status, 200);
  const { company } = await response.json();
  assert.equal(company.name, "New name");
  assert.equal(company.email, "admin@example.com");
  assert.equal(company.phone, "");
  assert.equal(company.isActive, undefined);
  assert.equal(company.sponsorshipInterests, undefined);
  assert.deepEqual(Company.findOneAndUpdate.mock.calls[0].arguments[0], {
    _id: companyId, isActive: true
  });
  assert.equal(Company.findOneAndUpdate.mock.calls[0].arguments[2].runValidators, true);
});

test("edit validates required fields, types, lengths, email and website", async () => {
  for (const invalid of [
    { name: " " }, { email: "invalid" }, { phone: 123 },
    { name: "a".repeat(151) }, { description: "a".repeat(2001) },
    { website: "javascript:alert(1)" }, { website: "example.com" }
  ]) {
    assert.equal((await request("PUT", { ...details, ...invalid })).status, 400);
  }
  assert.equal(Company.findOneAndUpdate.mock.callCount(), 0);
});

test("edit and delete reject invalid IDs", async () => {
  for (const method of ["PUT", "DELETE"]) {
    assert.equal((await request(method, details, "invalid-id")).status, 400);
  }
  assert.equal(Company.findOne.mock.callCount(), 0);
  assert.equal(Company.findOneAndUpdate.mock.callCount(), 0);
});

test("edit returns 404 for a missing or inactive company", async () => {
  Company.findOneAndUpdate.mock.mockImplementation(async () => null);
  assert.equal((await request("PUT", details)).status, 404);
});

test("delete returns 404 for a missing or inactive company", async () => {
  Company.findOne.mock.mockImplementation(async () => null);
  assert.equal((await request("DELETE")).status, 404);
  assert.equal(Company.findOneAndDelete.mock.callCount(), 0);
});

test("delete blocks companies with linked sponsorship requests", async () => {
  SponsorshipRequest.exists.mock.mockImplementation(async () => ({ _id: companyId }));
  assert.equal((await request("DELETE")).status, 409);
  assert.equal(Company.findOneAndDelete.mock.callCount(), 0);
});

test("delete blocks companies with linked user accounts", async () => {
  User.exists.mock.mockImplementation(async () => ({ _id: userId }));
  assert.equal((await request("DELETE")).status, 409);
  assert.equal(Company.findOneAndDelete.mock.callCount(), 0);
});

test("admin can delete an unlinked company", async () => {
  assert.equal((await request("DELETE")).status, 200);
  assert.deepEqual(Company.findOneAndDelete.mock.calls[0].arguments[0], {
    _id: companyId, isActive: true
  });
  assert.deepEqual(SponsorshipRequest.exists.mock.calls[0].arguments[0], { company: companyId });
  assert.deepEqual(User.exists.mock.calls[0].arguments[0], { company: companyId });
});

test("failed linked-record checks never delete the company", async () => {
  User.exists.mock.mockImplementation(async () => { throw new Error("Database unavailable"); });
  assert.equal((await request("DELETE")).status, 500);
  assert.equal(Company.findOneAndDelete.mock.callCount(), 0);
});

test("existing Add still works with shared validation", async () => {
  const response = await request("POST", details, "");
  assert.equal(response.status, 201);
  assert.equal((await response.json()).company.name, details.name);
});
