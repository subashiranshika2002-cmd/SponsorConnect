# White-Box Testing – SponsorConnect

## 1. Introduction

White-box testing evaluates the internal structure, logic, conditions and execution paths of a software application. Unlike black-box testing, this testing technique requires access to the source code.

White-box testing is applied to SponsorConnect to evaluate its internal logic, authorization rules, validation conditions and error-handling mechanisms.

## 2. Selected Core Function

- Application: SponsorConnect
- Module: Company Management
- Source File: `backend/controllers/companyController.js`
- Selected Function: `deleteCompany()`
- Testing Technique: White-Box Testing

The selected function allows administrators to delete active companies that have no linked sponsorship requests or user accounts.

The function was selected because it contains multiple decision points, database operations, authorization checks and exception-handling mechanisms.

## 3. Source Code Analysis

The `deleteCompany()` function contains five main conditional statements.

| Decision ID | Condition | True Outcome | False Outcome |
|---|---|---|---|
| D1 | User is not an admin | HTTP 403 | Continue |
| D2 | Company ID is invalid | HTTP 400 | Continue |
| D3 | Company does not exist | HTTP 404 | Continue |
| D4 | Linked requests or users exist | HTTP 409 | Continue |
| D5 | Deleted company is not found | HTTP 404 | HTTP 200 |

Unexpected exceptions are forwarded to the Express error-handling middleware using `next(error)`.

## 4. Control Flow Graph

The Control Flow Graph (CFG) represents the execution flow of the selected function.

The main execution sequence is:

1. Start the deletion process.
2. Check administrator permissions.
3. Validate the company identifier.
4. Check whether the active company exists.
5. Check for linked sponsorship requests and user accounts.
6. Attempt to delete the company.
7. Verify the deletion result.
8. Return the appropriate response.
9. End the process.

The simplified Control Flow Graph illustrates the five main decision points and their corresponding outcomes.

The exception-handling path is evaluated separately during automated testing.

## 5. Cyclomatic Complexity

Cyclomatic Complexity measures the number of linearly independent execution paths through a program.

The basic decision-point formula is:

**V(G) = P + 1**

Where:

- V(G) = Cyclomatic Complexity
- P = Number of decision points

The selected function contains five main if statements.

Therefore:

V(G) = 5 + 1

**V(G) = 6**

The simplified control flow contains six independent execution paths.

| Calculation Method | Complexity |
|---|---|
| Five main if statements | 6 |
| Including short-circuit logical OR | 7 |
| Including logical OR and catch | 8 |

The basic complexity value of 6 is calculated using the five main conditional statements. More detailed complexity measurements may differ depending on how the analysis tool counts logical operators, optional chaining and exception handling.

## 6. Statement Coverage

Statement Coverage measures the percentage of executable statements exercised during test execution.

**Statement Coverage (%) = (Executed Statements / Total Executable Statements) × 100**

The proposed test cases are designed to execute the following statements:

- Administrator authorization rejection.
- Invalid company identifier handling.
- Missing company handling.
- Linked sponsorship request protection.
- Linked user account protection.
- Successful company deletion.
- Unsuccessful company deletion.
- Exception handling.

The target statement coverage for the selected function is 100%.

Actual statement coverage will be measured using Jest after automated test execution.

## 7. Branch Coverage

Branch Coverage measures the percentage of decision outcomes exercised during testing.

**Branch Coverage (%) = (Executed Branches / Total Branches) × 100**

The five main if statements have two possible outcomes: True and False.

Therefore, the simplified decision model contains ten branch outcomes.

| Decision | True Branch | False Branch |
|---|---|---|
| D1 | Reject non-admin | Continue as admin |
| D2 | Reject invalid ID | Accept valid ID |
| D3 | Company not found | Company found |
| D4 | Linked records exist | No linked records |
| D5 | Deletion returns no company | Deletion successful |

Additional tests are designed to exercise the short-circuit logical OR condition and exception-handling path.

The target branch coverage is 100% for the selected function. Actual coverage will be recorded after test execution.

## 8. White-Box Test Cases and Actual Results

| Test ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| WB01 | Non-admin attempts company deletion | HTTP 403 | HTTP 403 verified | Pass |
| WB02 | Admin provides invalid company ID | HTTP 400 | HTTP 400 verified | Pass |
| WB03 | Company does not exist | HTTP 404 | HTTP 404 verified | Pass |
| WB04 | Linked sponsorship requests exist | HTTP 409 | HTTP 409 verified | Pass |
| WB05 | Linked user accounts exist | HTTP 409 | HTTP 409 verified | Pass |
| WB06 | Company exists without linked records | Successful deletion | Deletion operation and success response verified | Pass |
| WB07 | Deletion returns null | HTTP 404 | HTTP 404 verified | Pass |
| WB08 | Database operation throws an exception | Error forwarded to next(error) | Error forwarding verified | Pass |

## 9. Test Execution Summary

| Metric | Actual Result |
|---|---|
| Testing Framework | Jest 30.5.2 |
| Total Test Suites | 1 |
| Passed Test Suites | 1 |
| Total Test Cases | 8 |
| Passed Test Cases | 8 |
| Failed Test Cases | 0 |
| Pass Rate | 100% |
| Initial Execution Time | 1.175 seconds |
| Coverage Execution Time | 1.244 seconds |

All eight automated white-box test cases passed successfully.

Database operations were mocked during testing to prevent modification or deletion of actual MongoDB records.

## 10. Code Coverage Results

The Jest coverage report produced the following results for the complete companyController.js file.

| Coverage Metric | Actual Coverage |
|---|---|
| Statement Coverage | 33.84% |
| Branch Coverage | 21.81% |
| Function Coverage | 20.00% |
| Line Coverage | 33.84% |

### 10.1 Coverage Analysis

The companyController.js file contains five functions: getCompanies(), saveCompany(), createCompany(), updateCompany() and deleteCompany().

The selected test suite focuses specifically on the deleteCompany() function. Therefore, the reported coverage percentages represent the entire controller file rather than only the selected function.

The low overall coverage percentages are explained by the remaining functions that were not exercised by this test suite.

### 10.2 Branch Analysis of the Selected Function

The eight test cases exercised both outcomes of the five main if decisions, linked sponsorship request protection, linked user account protection and exception handling.

The simplified decision model therefore achieved coverage of all ten main decision outcomes.

This represents the manually analyzed decision coverage of the selected function and should not be confused with the instrumented branch coverage of the complete controller file.

## 11. Testing Evidence

The following evidence was collected:

- Source code of the selected function.
- Control Flow Graph.
- Jest automated test execution results.
- Jest code coverage report.

## 12. Recommended Improvements

- Add automated tests for the remaining controller functions.
- Increase statement and branch coverage across the complete backend.
- Include additional authentication and input validation scenarios.
- Integrate automated tests into a continuous integration pipeline.

## 13. Conclusion

White-box testing was successfully applied to the deleteCompany() function of SponsorConnect.

The source code analysis identified five main conditional decisions and a basic Cyclomatic Complexity of 6.

All eight automated test cases passed, verifying authorization checks, identifier validation, company existence, linked-record protection, successful deletion, unsuccessful deletion and exception handling under mocked database conditions.

The coverage report provides measurable evidence of the executed code and identifies areas requiring additional testing.