# Security and Usability Testing – SponsorConnect

## 1. Introduction

Security and usability testing were conducted to evaluate the access control, authentication mechanisms and user-friendliness of the SponsorConnect web application.

## 2. Security Testing

Manual security testing was performed using selected OWASP security concepts.

### 2.1 Security Test Cases

| Test ID | Security Category | Test Scenario | Expected Result | Result |
|---|---|---|---|---|
| SEC01 | Broken Access Control | Access company management features using a normal user account | Administrative functions are unavailable | Pass |
| SEC02 | Authentication Failures | Login using an incorrect password | Login rejected and error message displayed | Pass |

### 2.2 Security Testing Analysis

Role-based interface restrictions were evaluated by accessing the system using a normal user account. Administrative company management functions were not available to the normal user.

Authentication testing was conducted using invalid login credentials to verify that unauthorized login attempts were rejected.

### 2.3 Security Recommendations

- Enforce role-based authorization at backend API endpoints.
- Implement rate limiting for login attempts.
- Protect authentication tokens and sensitive credentials.
- Conduct additional automated security testing.
- Regularly review and update application dependencies.

## 3. Usability Testing

Manual usability testing was conducted to evaluate navigation, form validation and responsive design.

### 3.1 Usability Test Cases

| Test ID | Test Scenario | Expected Result | Result |
|---|---|---|---|
| USA01 | Navigation between application pages | Pages open correctly and navigation is understandable | Pass |
| USA02 | Submit a login form with empty fields | Appropriate validation messages are displayed | Pass |
| USA03 | Access the application using a simulated mobile screen | Content and controls remain accessible | Pass |

### 3.2 Usability Recommendations

- Maintain consistent navigation across all pages.
- Provide clear and understandable validation messages.
- Improve accessibility and mobile responsiveness where necessary.
- Conduct usability testing with additional users.

## 4. Testing Evidence

The following screenshots were collected during testing:

- SEC01_user_permissions.png
- SEC02_invalid_authentication.png
- USA01_navigation.png
- USA02_form_validation.png
- USA03_responsive_design.png

## 5. Limitations

Security testing was limited to selected manual scenarios. UI-level access restrictions alone do not prove that all backend endpoints are protected.

Usability testing was conducted in a local development environment using manual inspection and browser-based mobile simulation.

## 6. Conclusion

Selected security and usability scenarios were evaluated to identify potential weaknesses and assess the user experience of the SponsorConnect application.