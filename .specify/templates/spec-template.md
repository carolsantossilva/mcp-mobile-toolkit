# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "identify the primary build error"]
- **FR-002**: System MUST [validation behavior, e.g., "reject logs above the documented limit"]
- **FR-003**: Clients MUST be able to [key interaction, e.g., "call the tool with inline artifact content"]
- **FR-004**: System MUST [output requirement, e.g., "return ranked evidence for the conclusion"]
- **FR-005**: System MUST [failure behavior, e.g., "return low confidence when evidence is insufficient"]
- **FR-006**: System MUST define MCP-facing tool contracts, schemas, and error
  behavior for any protocol-visible capability.
- **FR-007**: System MUST state target mobile platforms and any unsupported
  simulator, emulator, or physical-device behavior.
- **FR-008**: System MUST protect secrets, device data, logs, screenshots,
  recordings, tokens, and permission-sensitive actions from unintended exposure.

*Example of marking unclear requirements:*

- **FR-009**: System MUST classify feedback in [NEEDS CLARIFICATION: supported languages not specified]
- **FR-010**: System MUST accept artifacts up to [NEEDS CLARIFICATION: maximum input size not specified]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Contract metric, e.g., "All documented fixtures validate against the output schema"]
- **SC-002**: [Performance metric, e.g., "A 100,000-character log is analyzed within 500 ms"]
- **SC-003**: [Quality metric, e.g., "Primary root cause is ranked first for all acceptance fixtures"]
- **SC-004**: [Reliability metric, e.g., "Equivalent normalized inputs produce byte-equivalent JSON"]

## Constitution Alignment *(mandatory)*

- **MCP Contract Impact**: [Tool contracts, schemas, outputs, errors, or N/A]
- **Mobile Platform Scope**: [iOS, Android, simulator, emulator, physical device, or N/A]
- **Required Tests**: [Contract, integration, unit, manual validation, or N/A with rationale]
- **Security and Consent Boundaries**: [Sensitive data, permissions, credentials, redaction, or N/A]
- **Diagnostics**: [User-visible or operator-visible failure diagnostics]

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- [Assumption about target users, e.g., "Callers provide sanitized mobile engineering artifacts"]
- [Assumption about scope boundaries, e.g., "The tool analyzes inline text and does not read local files"]
- [Assumption about data/environment, e.g., "Analysis is deterministic and runs without network access"]
- [Dependency on existing system/service, e.g., "Requires the MCP TypeScript SDK and Zod"]
