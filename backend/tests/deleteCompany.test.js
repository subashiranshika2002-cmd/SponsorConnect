jest.mock("../models/Company");
jest.mock("../models/SponsorshipRequest");
jest.mock("../models/User");

const Company = require("../models/Company");
const SponsorshipRequest = require("../models/SponsorshipRequest");
const User = require("../models/User");

const {
  deleteCompany
} = require("../controllers/companyController");

describe("White-Box Testing - deleteCompany", () => {

  const validId = "507f1f77bcf86cd799439011";

  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.resetAllMocks();

    req = {
      user: { role: "admin" },
      params: { id: validId }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  // WB01 - Non-admin deletion
  test("WB01: Reject non-admin with HTTP 403", async () => {

    req.user.role = "user";

    await deleteCompany(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(Company.findOneAndDelete).not.toHaveBeenCalled();
  });

  // WB02 - Invalid company ID
  test("WB02: Reject invalid ID with HTTP 400", async () => {

    req.params.id = "invalid-id";

    await deleteCompany(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // WB03 - Company not found
  test("WB03: Return HTTP 404 when company is missing", async () => {

    Company.findOne.mockResolvedValue(null);

    await deleteCompany(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // WB04 - Linked sponsorship requests
  test("WB04: Reject deletion when requests exist", async () => {

    Company.findOne.mockResolvedValue({ _id: validId });

    SponsorshipRequest.exists.mockResolvedValue({
      _id: validId
    });

    User.exists.mockResolvedValue(null);

    await deleteCompany(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(Company.findOneAndDelete).not.toHaveBeenCalled();
  });

  // WB05 - Linked user accounts
  test("WB05: Reject deletion when linked users exist", async () => {

    Company.findOne.mockResolvedValue({ _id: validId });

    SponsorshipRequest.exists.mockResolvedValue(null);

    User.exists.mockResolvedValue({
      _id: validId
    });

    await deleteCompany(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(Company.findOneAndDelete).not.toHaveBeenCalled();
  });

  // WB06 - Successful deletion
  test("WB06: Successfully delete an unlinked company", async () => {

    Company.findOne.mockResolvedValue({ _id: validId });

    SponsorshipRequest.exists.mockResolvedValue(null);
    User.exists.mockResolvedValue(null);

    Company.findOneAndDelete.mockResolvedValue({
      _id: validId
    });

    await deleteCompany(req, res, next);

    expect(Company.findOneAndDelete).toHaveBeenCalledWith({
      _id: validId,
      isActive: true
    });

    expect(res.json).toHaveBeenCalledWith({
      message: "Company deleted successfully"
    });

    expect(res.status).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  // WB07 - Deletion returns null
  test("WB07: Return HTTP 404 when deletion returns null", async () => {

    Company.findOne.mockResolvedValue({ _id: validId });

    SponsorshipRequest.exists.mockResolvedValue(null);
    User.exists.mockResolvedValue(null);

    Company.findOneAndDelete.mockResolvedValue(null);

    await deleteCompany(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // WB08 - Database exception
  test("WB08: Forward database exception to middleware", async () => {

    const error = new Error("Database error");

    Company.findOne.mockRejectedValue(error);

    await deleteCompany(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

});