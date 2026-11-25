# Unit Testing and Behavior-Driven Development – SponsorConnect

## 1. Introduction

Unit testing and Behavior-Driven Development (BDD) are applied to SponsorConnect to verify individual software functions and expected application behavior.

Jest is used for unit testing, while Cucumber.js is used to implement and execute BDD scenarios written in Gherkin.

## 2. Unit Testing

Unit testing evaluates individual software functions independently from other system components.

The deleteCompany() function in backend/controllers/companyController.js was selected for unit testing.

Database operations were mocked to isolate the controller logic and prevent changes to actual MongoDB records.

### 2.1 Unit Test Results

| Test ID | Test Scenario | Expected Result | Status |
|---|---|---|---|
| WB01 | Non-admin attempts deletion | HTTP 403 | Pass |
| WB02 | Invalid company ID | HTTP 400 | Pass |
| WB03 | Company not found | HTTP 404 | Pass |
| WB04 | Linked sponsorship requests exist | HTTP 409 | Pass |
| WB05 | Linked user accounts exist | HTTP 409 | Pass |
| WB06 | Successful company deletion | Success response | Pass |
| WB07 | Deletion returns null | HTTP 404 | Pass |
| WB08 | Database exception | Error forwarded to middleware | Pass |

### 2.2 Unit Testing Summary

- Testing Framework: Jest 30.5.2
- Total Test Cases: 8
- Passed: 8
- Failed: 0
- Pass Rate: 100%

The unit tests successfully verified the selected controller's authorization, validation, deletion and exception-handling logic under mocked database conditions.

## 3. Behavior-Driven Development

Behavior-Driven Development describes expected software behavior using natural-language scenarios.

Gherkin uses the following keywords:

- Given: Defines the initial conditions.
- When: Defines the action performed.
- Then: Defines the expected outcome.
- And: Adds additional conditions or actions.

## 4. BDD Implementation

The BDD scenarios are implemented using Cucumber.js.

Feature file:

backend/features/companyDeletion.feature

Step definition file:

backend/features/step_definitions/companyDeletion.steps.js

### 4.1 Scenario 01 – Administrator Deletes an Unlinked Company

- Given the user is an administrator.
- And the company exists without linked records.
- When the user attempts to delete the company.
- Then the deletion should be successful.

### 4.2 Scenario 02 – Normal User Attempts Company Deletion

- Given the user is a normal user.
- When the user attempts to delete the company.
- Then the response status should be 403.

## 5. BDD Test Results

| Scenario ID | Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| BDD01 | Administrator deletes an unlinked company | Successful deletion | Success response verified | Pass |
| BDD02 | Normal user attempts company deletion | HTTP 403 | HTTP 403 verified | Pass |

### 5.1 BDD Execution Summary

| Metric | Result |
|---|---|
| Testing Tool | Cucumber.js |
| Total Scenarios | 2 |
| Passed Scenarios | 2 |
| Failed Scenarios | 0 |
| Total Gherkin Steps | 7 |
| Passed Steps | 7 |
| Scenario Pass Rate | 100% |

## 6. Testing Evidence

- Jest unit test execution results.
- Gherkin feature file.
- JavaScript step definitions.
- Cucumber.js execution results.

## 7. Benefits of Unit Testing and BDD

- Early identification of software defects.
- Improved understanding of expected system behavior.
- Verification of authorization and business rules.
- Repeatable automated testing.
- Improved maintainability.
- Support for regression testing and continuous integration.

## 8. Conclusion

Unit testing and BDD were successfully applied to the selected company deletion functionality of SponsorConnect.

Eight Jest unit tests and two Cucumber BDD scenarios verified the expected controller behavior under mocked database conditions.

These tests provide a foundation for future regression testing and integration with a CI/CD pipeline. Live database operations and HTTP-level authorization require separate integration and API testing.