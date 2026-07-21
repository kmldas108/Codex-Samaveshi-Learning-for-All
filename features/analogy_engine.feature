Feature: Regional Pedagogical Analogy Engine
  As a decentralized education agent inside Samaveshi
  I want to translate abstract academic concepts into hyper-localized cultural analogies
  So that students can comprehend complex material without context barriers.

  Background:
    Given the user profile indicates a localized context of "Rural Karnataka"
    And the student's primary language preference is "Kannada"
    And the target academic level is set to "Grade 6"

  Scenario: Successfully mapping a biological concept to local agricultural practices
    Given the user uploads a textbook image depicting "Photosynthesis"
    When the Easy Read Agent processes the visual and textual data
    Then the agent should query the Regional Context MCP Server for "Agricultural/Farming analogies"
    And the generated output must explain the role of sunlight using the "Rice Paddy farming cycles" analogy
    And the final output syntax must be simplified to a readability score matching Grade 6
    And the text must be fully translated into grammatically accurate Kannada