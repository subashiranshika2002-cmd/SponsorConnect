# Defect Tracking and Root Cause Analysis – SponsorConnect

## 1. Introduction

Defect tracking was performed to identify, document, investigate and monitor software defects detected during the testing process. GitHub Issues was selected as the defect management tool.

## 2. Defect Tracking Tool

GitHub Issues was used to record defect descriptions, severity, priority, reproduction steps, developer assignments and retesting results.

## 3. Defect Report

| Attribute | Details |
|---|---|
| Defect ID | BUG-001 |
| GitHub Issue | #1 |
| Module | Authentication |
| Description | Admin Login API returned HTTP 500 during testing |
| Severity | High |
| Priority | High |
| Expected Result | HTTP 200 OK |
| Actual Result | HTTP 500 Internal Server Error |
| Initial Response Time | 30.03 seconds |
| Retest Response Time | 545 ms |
| Retest Result | Pass |
| Status | Open – Investigation pending |

## 4. Preliminary Root Cause Analysis

During Postman API testing, the administrator login request returned HTTP 500 Internal Server Error.

The response time of approximately 30 seconds suggests a possible database connectivity issue or backend operation timeout.

Possible contributing factors include:

- Temporary MongoDB Atlas connectivity problems.
- Database operation timeout.
- Insufficient backend error handling.
- Network connectivity issues.

The exact root cause was not confirmed through backend logs. Therefore, these factors remain preliminary hypotheses.

## 5. Defect Life Cycle

The standard defect life cycle consists of the following stages:

1. New – A defect is identified and reported.
2. Assigned – The defect is assigned to a responsible developer.
3. In Progress – The developer investigates the root cause.
4. Fixed – Corrective changes are implemented.
5. Retesting – The tester verifies the corrective changes.
6. Verified – The expected functionality is confirmed.
7. Closed – The verified defect is formally closed.
8. Reopened – The defect is reopened if the problem persists.

## 6. Retesting Results

A subsequent administrator login request returned HTTP 200 OK with a valid authentication token.

The retest passed successfully. However, no confirmed code-level fix was implemented. Therefore, the issue remains open for further investigation.

## 7. Recommended Corrective Actions

- Improve backend error logging.
- Monitor MongoDB connectivity.
- Implement appropriate database timeout handling.
- Improve exception handling.
- Introduce automated authentication regression tests.

## 8. Testing Evidence

- BUG01_defect_created.png
- BUG02_root_cause_analysis.png
- BUG03_retesting_update.png

GitHub Issue:
https://github.com/subashiranshika2002-cmd/SponsorConnect/issues/1

## 9. Conclusion

GitHub Issues was successfully used to document and track an observed authentication failure. The defect management process demonstrated defect identification, reporting, assignment, preliminary investigation and retesting. Further investigation is required before the issue can be classified as resolved.