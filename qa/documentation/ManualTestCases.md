# Manual Functional Test Cases – SponsorConnect

## Test Environment

- Application: SponsorConnect
- Test Type: Manual Functional Testing
- Browser: Google Chrome
- Test Date: 25 November 2026

## Test Cases

| Test ID | Description | Preconditions | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC01 | Valid login | Registered account exists | Enter valid email and password; click Login | Dashboard opens | Dashboard opened successfully | Pass |
| TC02 | Invalid password | Registered account exists | Enter valid email and incorrect password | Login rejected | Invalid password was rejected | Pass |
| TC03 | Empty login fields | Login page is open | Leave fields empty; click Login | Validation message displayed | Required field validation displayed | Pass |
| TC04 | Invalid registration email | Registration page is open | Enter an invalid email and submit | Registration rejected | Invalid email was rejected | Pass |
| TC05 | Read company records | User logged in | Open Companies page | Company records displayed | Company records displayed successfully | Pass |
| TC06 | Search company | Companies exist | Search using an existing company name | Matching companies displayed | Matching companies displayed | Pass |
| TC07 | Create company | Admin logged in | Enter valid fictional company details and submit | Company created | Test company created successfully | Pass |
| TC08 | Update company | Admin logged in; test company exists | Edit test company details and save | Updated details displayed | Company details updated successfully | Pass |
| TC09 | Delete company | Admin logged in; unlinked test company exists | Delete test company and confirm | Company removed | Test company deleted successfully | Pass |
| TC10 | Unauthorized company creation | Normal user logged in | Inspect company management controls | Create company control unavailable | Create company control was unavailable | Pass |
| TC11 | Submit valid sponsorship request | Organizer logged in; company exists | Complete valid test event details and submit | Request saved successfully | Sponsorship request saved successfully | Pass |
| TC12 | Invalid audience value | Organizer logged in | Enter audience value 0 and submit | Request rejected | Invalid audience value was rejected | Pass |
| TC13 | Invalid PDF upload | Organizer logged in | Attempt to attach a non-PDF file | Invalid file rejected | Invalid file upload was rejected | Pass |
| TC14 | Send message | User has access to a test conversation | Enter a valid message and send | Message saved and displayed | Message sent and displayed successfully | Pass |
| TC15 | Logout | User logged in | Click Logout | Login page displayed | User logged out successfully | Pass |

## Test Execution Summary

- Total Test Cases: 15
- Passed: 15
- Failed: 0
- Blocked: 0
- Not Run: 0
- Test Execution Rate: 100.00%
- Pass Rate: 100.00%

## Conclusion

All 15 planned manual functional test cases were executed successfully. The actual results matched the expected results for the tested scenarios.

The results indicate that the selected authentication, company management, sponsorship request, input validation and messaging functionalities behaved as expected during manual testing.

Further automated, security, performance and white-box testing is required to evaluate the overall quality of the application.