# Software Test Plan – SponsorConnect

## 1. Introduction

SponsorConnect is a MERN-based sponsorship management web application that connects event organizers with potential sponsoring companies. The system supports user authentication, company management, sponsorship requests and communication between users and company representatives.

This test plan defines the testing activities required to evaluate the functionality, reliability, security, usability and maintainability of the application.

## 2. Testing Objectives

- Verify that the application meets its functional requirements.
- Identify software defects and input validation issues.
- Verify authentication and role-based access control.
- Ensure database operations work correctly.
- Evaluate application performance, security and code quality.
- Improve software quality through manual and automated testing.

## 3. Testing Scope

### 3.1 In Scope

- User registration and login.
- Company Create, Read, Update and Delete operations.
- Role-based access control.
- Company search and filtering.
- Sponsorship request submission and validation.
- PDF upload validation.
- Messaging and message validation.

### 3.2 Out of Scope

- Paid OpenAI writing assistance.
- Actual email delivery through external email services.
- Unimplemented proposal approval workflow.
- Production deployment.

## 4. Testing Resources and Environment

| Component | Technology |
|---|---|
| Operating System | Windows 11 |
| Frontend | React and Vite |
| Backend | Node.js and Express.js |
| Database | MongoDB Atlas |
| Browser | Google Chrome |
| Development Environment | Visual Studio Code |
| Version Control | Git and GitHub |
| Testing Branch | qa/software-testing |
| API Testing | Postman |
| Unit Testing | Jest |
| BDD Testing | Cucumber.js |
| CI/CD | GitHub Actions |
| Performance Testing | Apache JMeter |
| Defect Tracking | GitHub Issues |
| Static Code Analysis | SonarQube |

## 5. Testing Schedule

| Phase | Activity |
|---|---|
| Phase 1 | Environment setup and smoke testing |
| Phase 2 | Test planning and test case design |
| Phase 3 | Black-box and white-box testing |
| Phase 4 | Unit testing and BDD |
| Phase 5 | Test automation and CI/CD |
| Phase 6 | Performance, security and usability testing |
| Phase 7 | Defect tracking and root cause analysis |
| Phase 8 | Quality metrics and test closure |

## 6. Entry Criteria

- Application source code is available.
- Frontend and backend servers are running.
- Database connection is established.
- Required test accounts and test data are available.

## 7. Exit Criteria

- Planned test cases have been executed or documented with reasons for any blocked tests.
- Test results and defects have been recorded.
- Critical defects have been evaluated.
- Available automation and quality analysis results have been documented.
- The final testing report has been prepared.

## 8. Software Quality Attributes

The SponsorConnect application will be evaluated using selected ISO 25010 software quality characteristics.

- **Functional Suitability:** Verify that the implemented features satisfy the specified functional requirements.
- **Reliability:** Evaluate the application's ability to handle invalid inputs and unexpected failures.
- **Usability:** Evaluate navigation, form design and the clarity of error messages.
- **Security:** Verify authentication, authorization and protection of user information.
- **Performance Efficiency:** Measure API response times and system behavior under concurrent requests.
- **Maintainability:** Evaluate source code complexity, duplication, code smells and technical debt.

## 9. Verification and Validation

### 9.1 Verification

Verification evaluates whether the software has been developed according to its specified requirements and design.

The planned verification activities for SponsorConnect include:

- Reviewing functional requirements.
- Reviewing source code and validation logic.
- Reviewing test plans and test cases.
- Performing static code analysis using SonarQube.

### 9.2 Validation

Validation evaluates whether the implemented application satisfies the intended user needs.

The planned validation activities for SponsorConnect include:

- Executing manual functional tests.
- Testing registration and login.
- Testing company CRUD operations.
- Verifying role-based access control.
- Executing automated API tests.
- Performing performance and usability testing.