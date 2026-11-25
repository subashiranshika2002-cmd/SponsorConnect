Feature: Company Deletion

  As a SponsorConnect user
  I want company deletion to follow authorization rules
  So that company records are protected

  Scenario: Administrator deletes an unlinked company
    Given the user is an administrator
    And the company exists without linked records
    When the user attempts to delete the company
    Then the deletion should be successful

  Scenario: Normal user attempts company deletion
    Given the user is a normal user
    When the user attempts to delete the company
    Then the response status should be 403