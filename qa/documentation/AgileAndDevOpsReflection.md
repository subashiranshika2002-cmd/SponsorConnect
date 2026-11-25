# Agile and DevOps Reflection – SponsorConnect

## 1. Agile Testing

Agile testing promotes continuous testing throughout the software development life cycle instead of limiting testing to the final development stage.

In SponsorConnect, testing activities included manual testing, black-box testing, white-box testing, unit testing, API testing, performance testing and security testing.

## 2. DevOps Practices

Git and GitHub were used for version control and collaboration. A separate QA branch was maintained to organize testing activities without directly affecting the main development branch.

GitHub Actions was configured to automatically execute Jest unit tests and Cucumber BDD scenarios whenever relevant changes were pushed to the repository.

The successful CI workflow demonstrated the benefits of continuous integration and automated regression testing.

## 3. Benefits Achieved

- Early identification of software defects.
- Improved confidence in application functionality.
- Repeatable automated testing.
- Better documentation and traceability.
- Reduced manual regression testing effort.
- Improved collaboration between development and testing activities.

## 4. Challenges Encountered

- Temporary API authentication failure during Postman testing.
- Configuration of performance and quality analysis tools.
- Limited test coverage across the application.
- SonarQube scanner authentication failure.
- Limited time available for comprehensive testing.

## 5. Lessons Learned

The testing process demonstrated that software quality requires a combination of functional, structural, performance, security and usability testing.

Automated testing and continuous integration help identify problems early. However, automated tests must be supported by manual testing, accurate documentation and systematic defect investigation.

## 6. Future Improvements

- Expand automated regression test suites.
- Increase code coverage.
- Integrate SonarQube analysis into GitHub Actions.
- Perform larger-scale performance and security tests.
- Improve defect investigation and resolution procedures.

## 7. Conclusion

The SponsorConnect testing process demonstrated the practical application of software testing, quality assurance, Agile testing and DevOps principles. Continuous improvement and expanded test automation would further improve the reliability and maintainability of the application.