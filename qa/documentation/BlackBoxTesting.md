# Black-Box Testing – SponsorConnect

## 1. Introduction

Black-box testing evaluates the functionality of an application without examining its internal source code. The tester provides input values and compares the actual outputs with the expected results.

The following black-box testing techniques are applied to SponsorConnect:

- Equivalence Partitioning (EP)
- Boundary Value Analysis (BVA)
- Decision Table Testing

## 2. Equivalence Partitioning

Equivalence Partitioning divides input data into valid and invalid classes. Representative values are selected from each class to reduce unnecessary test cases.

### 2.1 Email Validation

| Test ID | Equivalence Class | Test Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| EP01 | Valid email | qauser@example.com | Accepted | Accepted | Pass |
| EP02 | Invalid email format | qauserexample.com | Rejected | Rejected | Pass |
| EP03 | Missing email | Empty | Rejected | Rejected | Pass |

### 2.2 Expected Audience Validation

The valid audience range is from 1 to 10,000,000 whole-number attendees.

| Test ID | Equivalence Class | Test Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| EP04 | Valid audience | 250 | Accepted | Accepted | Pass |
| EP05 | Below minimum | 0 | Rejected | Rejected | Pass |
| EP06 | Above maximum | 15000000 | Rejected | Rejected | Pass |
| EP07 | Non-integer value | 25.5 | Rejected | Rejected | Pass |

### 2.3 PDF Upload Validation

The application supports optional PDF documents with a maximum file size of 5 MB.

| Test ID | Equivalence Class | Test Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| EP08 | Valid PDF | PDF below 5 MB | Accepted | Accepted | Pass |
| EP09 | Invalid file type | JPG or PNG file | Rejected | Rejected | Pass |
| EP10 | Excessive file size | PDF above 5 MB | Rejected | Rejected | Pass |

### 2.4 Equivalence Partitioning Results

- Total Test Cases: 10
- Passed: 10
- Failed: 0
- Pass Rate: 100%

All tested equivalence classes produced the expected results.

## 3. Boundary Value Analysis

Boundary Value Analysis is a black-box testing technique that evaluates input values at and around the minimum and maximum limits of an accepted range.

### 3.1 Expected Audience Validation

The SponsorConnect application accepts whole-number audience values between 1 and 10,000,000.

- Minimum boundary: 1
- Maximum boundary: 10,000,000

| Test ID | Boundary Condition | Test Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| BVA01 | Minimum - 1 | 0 | Rejected | Rejected | Pass |
| BVA02 | Minimum | 1 | Accepted | Accepted | Pass |
| BVA03 | Minimum + 1 | 2 | Accepted | Accepted | Pass |
| BVA04 | Maximum - 1 | 9999999 | Accepted | Accepted | Pass |
| BVA05 | Maximum | 10000000 | Accepted | Accepted | Pass |
| BVA06 | Maximum + 1 | 10000001 | Rejected | Rejected | Pass |

The remaining sponsorship request fields were populated with valid test data to isolate the audience validation behavior.

### 3.2 Boundary Value Analysis Results

- Total Test Cases: 6
- Passed: 6
- Failed: 0
- Pass Rate: 100%

The application correctly accepted valid boundary values and rejected values outside the specified range.

## 4. Current Black-Box Testing Summary

| Testing Technique | Total Tests | Passed | Failed | Pass Rate |
|---|---|---|---|---|
| Equivalence Partitioning | 10 | 10 | 0 | 100% |
| Boundary Value Analysis | 6 | 6 | 0 | 100% |
| Total | 16 | 16 | 0 | 100% |

## 4. Decision Table Testing

Decision Table Testing evaluates the behavior of an application under different combinations of conditions. In SponsorConnect, this technique is applied to role-based access control in the company management module.

### 4.1 Decision Table

| Conditions and Actions | R1 | R2 | R3 | R4 | R5 |
|---|---|---|---|---|---|
| Authenticated | Yes | Yes | Yes | Yes | No |
| User role | Admin | Manager | Manager | Normal User | None |
| Target is assigned company | N/A | Yes | No | N/A | N/A |
| View company directory | Allow | Allow | Allow | Allow | Allow |
| Create company | Allow | Deny | Deny | Deny | Deny |
| Update company | Allow | Allow | Deny | Deny | Deny |
| Delete unlinked company | Allow | Deny | Deny | Deny | Deny |

### 4.2 Decision Table Test Cases

### 4.2 Decision Table Test Cases

| Test ID | Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| DT01 | Admin creates a company | Allowed | Company created successfully | Pass |
| DT02 | Admin updates a company | Allowed | Company updated successfully | Pass |
| DT03 | Admin deletes an unlinked company | Allowed | Company deleted successfully | Pass |
| DT04 | Normal user checks company creation controls | Unavailable | Create button not displayed | Pass |
| DT05 | Normal user checks company update controls | Unavailable | Edit button not displayed | Pass |
| DT06 | Manager updates assigned company | Allowed | Assigned company updated successfully | Pass |
| DT07 | Manager attempts to update another company through API | Denied | Edit button hidden; API verification pending | Not Run |
| DT08 | Manager attempts company deletion through API | Denied | Delete button hidden; API verification pending | Not Run |
| DT09 | Unauthenticated user attempts company creation through API | Denied | API verification pending | Not Run |
| DT10 | Admin attempts to delete a linked company | Denied | API verification pending | Not Run |

### 4.3 Additional Company Manager UI Checks

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| Assigned company Edit button | Visible | Visible | Pass |
| Other companies Edit buttons | Hidden | Hidden | Pass |
| Delete Company button | Hidden | Hidden | Pass |
| Create Company button | Hidden | Hidden | Pass |

The UI-level tests indicate that company management controls are displayed according to the authenticated user's role and company ownership.

Backend authorization will be verified separately using Postman API testing.

## 5. Black-Box Testing Summary

| Testing Technique | Planned Tests | Passed | Failed | Pending |
|---|---|---|---|---|
| Equivalence Partitioning | 10 | 10 | 0 | 0 |
| Boundary Value Analysis | 6 | 6 | 0 | 0 |
| Decision Table Testing | 10 | 6 | 0 | 4 |
| Total | 26 | 22 | 0 | 4 |

All completed test cases produced the expected results. Four backend authorization tests remain pending and will be completed during API testing.

## 6. Conclusion

Black-box testing was applied to evaluate input validation, boundary conditions and role-based access control in SponsorConnect. The completed tests indicate that the selected features behave according to their expected requirements. Further API testing is required to confirm backend authorization independently of the user interface.