# API Test Automation – SponsorConnect

## 1. Introduction

API testing was performed using Postman to verify the functionality of the SponsorConnect REST API independently of the frontend interface.

Automated JavaScript assertions were implemented using Postman to validate HTTP response status codes, response data and expected CRUD behavior.

## 2. Testing Environment

| Component | Configuration |
|---|---|
| Testing Tool | Postman |
| Backend | Node.js and Express.js |
| Database | MongoDB Atlas |
| Base URL | http://localhost:5000 |
| Authentication | JWT Bearer Token |
| Automation Language | JavaScript |

## 3. Automated API Test Results

| Test ID | Operation | HTTP Method | Expected Status | Actual Status | Result |
|---|---|---|---|---|---|
| API01 | Admin Login | POST | 200 | 200 | Pass |
| API02 | Retrieve Companies | GET | 200 | 200 | Pass |
| API03 | Create Company | POST | 201 | 201 | Pass |
| API04 | Update Company | PUT | 200 | 200 | Pass |
| API05 | Delete Company | DELETE | 200 | 200 | Pass |

## 4. Automation Approach

Postman post-response scripts were used to automatically verify HTTP status codes and response content.

The automated assertions included:

- Authentication token availability.
- Company array availability.
- Successful creation of company records.
- Correct updated company name and address.
- Successful company deletion response.

Fictional company records were used for CRUD testing.

## 5. Defect Observation

An initial login request returned HTTP 500 Internal Server Error. A subsequent execution returned HTTP 200 successfully.

The exact root cause of the initial failure was not confirmed. The observation was retained for defect analysis and further investigation.

## 6. Testing Limitations

API testing focused on authentication and company CRUD operations.

Additional negative API tests and backend authorization scenarios were deferred due to submission time constraints. UI-level authorization checks and mocked controller tests were performed separately.

## 7. Conclusion

Postman API automation was applied to verify selected authentication and CRUD operations. The results demonstrate the use of repeatable automated assertions for evaluating REST API functionality.