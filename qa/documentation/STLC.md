# Software Testing Life Cycle – SponsorConnect

## 1. Requirement Analysis

The functional and non-functional requirements of SponsorConnect are analyzed to identify testable features, including authentication, company CRUD operations, role-based access control, sponsorship requests, PDF validation and messaging.

## 2. Test Planning

A test plan is prepared to define testing objectives, scope, resources, testing tools, quality attributes and the testing schedule.

## 3. Test Case Design

Test cases are designed based on functional requirements using Equivalence Partitioning, Boundary Value Analysis, Decision Table Testing and White-Box Testing.

Each test case includes an ID, description, preconditions, test steps, expected result, actual result and execution status.

## 4. Test Environment Setup

| Component | Configuration |
|---|---|
| Operating System | Windows 11 |
| Browser | Google Chrome |
| Frontend | React and Vite |
| Backend | Node.js v25.6.0 and Express.js |
| Database | MongoDB Atlas |
| npm | 11.8.0 |
| Git | 2.53.0 |
| Docker | 29.8.2 |
| IDE | Visual Studio Code |
| Frontend URL | http://localhost:5173 |
| Backend URL | http://localhost:5000 |
| Testing Branch | qa/software-testing |

The frontend, backend and database connection were successfully verified during initial smoke testing.

Separate test accounts for administrators, normal users and company managers will be used. Fictional company records and sponsorship requests will be used as test data.

## 5. Test Execution

Manual and automated tests are executed against the application. Actual results are compared with expected results, and tests are marked as Pass, Fail or Blocked.

Initial smoke testing has been completed. Further testing will be performed according to the test plan.

## 6. Test Closure

Test execution results, identified defects, coverage reports and software quality metrics will be reviewed and documented.

The final report will summarize the testing activities, results, limitations and recommended improvements.