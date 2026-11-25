# Software Quality Analysis – SponsorConnect

## 1. Objective

The objective of software quality analysis was to evaluate code quality, maintainability, reliability, security and test coverage.

## 2. SonarQube Configuration

The following configuration activities were completed:

- Docker Desktop and Docker Engine initialization.
- SonarQube Community Build installation using Docker.
- Local SonarQube server configuration on port 9000.
- SponsorConnect project creation.
- SonarScanner for NPM installation.
- Source code and coverage configuration.

## 3. Analysis Status

| Activity | Status |
|---|---|
| Docker configuration | Completed |
| SonarQube installation | Completed |
| Project creation | Completed |
| Scanner installation | Completed |
| Server connection | Successful |
| Scanner authentication | Failed – HTTP 401 |
| Static code analysis | Incomplete |

The scanner successfully connected to the SonarQube server. However, an authentication error prevented the completion of the analysis.

## 4. Available Code Coverage Results

Previously generated Jest coverage results for the company controller are presented below.

| Metric | Result |
|---|---|
| Unit Tests | 8/8 Passed |
| Statement Coverage | 33.84% |
| Branch Coverage | 21.81% |
| Function Coverage | 20.00% |
| Line Coverage | 33.84% |

These measurements represent the tested company controller rather than the entire application.

## 5. Software Quality Metrics

| Metric | Result |
|---|---|
| Code Coverage | Available through Jest |
| Code Smells | Not measured |
| Defect Density | Not measured |
| Technical Debt | Not measured |
| SonarQube Quality Gate | Not available |

## 6. Recommended Improvements

- Increase unit test coverage across backend controllers.
- Improve branch and function coverage.
- Refactor duplicated and unnecessarily complex code.
- Review security vulnerabilities in application dependencies.
- Complete SonarQube authentication and static analysis.
- Integrate continuous code quality analysis into the CI pipeline.

## 7. Limitations

SonarQube configuration was completed, but static analysis could not be executed successfully due to an authentication issue. Therefore, unverified quality metrics have not been reported.

## 8. Conclusion

Software quality was partially evaluated using Jest coverage measurements. SonarQube was successfully configured, but further troubleshooting is required to obtain comprehensive static code quality metrics.