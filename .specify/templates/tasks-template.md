---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include test tasks when required by the constitution or feature
specification. MCP contract tests are REQUIRED for protocol-visible changes.
Integration tests are REQUIRED for workflows crossing process, device,
simulator, emulator, physical-device, or network boundaries.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Tool contracts from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Define shared Zod input/output schemas in src/contracts/common.ts
- [ ] T005 [P] Implement MCP result and sanitized error helpers in src/server/tool-result.ts
- [ ] T006 [P] Implement input limits and redaction helpers in src/shared/
- [ ] T007 Create the MCP server factory and tool registry in src/server/
- [ ] T008 Configure stderr-only diagnostics for stdio transport
- [ ] T009 Create the MCP contract-test harness
- [ ] T010 Define MCP contract validation approach for protocol-facing changes
- [ ] T011 Define sensitive-data redaction and artifact retention safeguards

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (REQUIRED when constitution applies) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T012 [P] [US1] Contract test for [MCP tool/schema] in tests/contract/[name].test.ts
- [ ] T013 [P] [US1] Integration test for [MCP tool journey] in tests/integration/[name].test.ts

### Implementation for User Story 1

- [ ] T014 [P] [US1] Define [tool] input/output schemas in src/contracts/[tool].ts
- [ ] T015 [P] [US1] Add rule fixtures in tests/fixtures/[tool]/
- [ ] T016 [US1] Implement pure analysis rules in src/tools/[tool]/ (depends on T014, T015)
- [ ] T017 [US1] Register the MCP tool in src/tools/[tool]/index.ts
- [ ] T018 [US1] Add validation, redaction, and error handling
- [ ] T019 [US1] Add diagnostics for user story 1 operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (REQUIRED when constitution applies) ⚠️

- [ ] T020 [P] [US2] Contract test for [MCP tool/schema] in tests/contract/[name].test.ts
- [ ] T021 [P] [US2] Integration test for [MCP tool journey] in tests/integration/[name].test.ts

### Implementation for User Story 2

- [ ] T022 [P] [US2] Define [tool] schemas and fixtures
- [ ] T023 [US2] Implement pure analysis rules in src/tools/[tool]/
- [ ] T024 [US2] Register the MCP tool and structured result
- [ ] T025 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (REQUIRED when constitution applies) ⚠️

- [ ] T026 [P] [US3] Contract test for [MCP tool/schema] in tests/contract/[name].test.ts
- [ ] T027 [P] [US3] Integration test for [MCP tool journey] in tests/integration/[name].test.ts

### Implementation for User Story 3

- [ ] T028 [P] [US3] Define [tool] schemas and fixtures
- [ ] T029 [US3] Implement pure analysis rules in src/tools/[tool]/
- [ ] T030 [US3] Register the MCP tool and structured result

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests (if requested) in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Constitution-required tests MUST be written and FAIL before implementation
- Contracts and fixtures before analyzers
- Analyzers before MCP registration
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (when required):
Task: "Contract test for [MCP tool/schema] in tests/contract/[name].test.ts"
Task: "Integration test for [MCP tool journey] in tests/integration/[name].test.ts"

# Launch independent contract and fixture work for User Story 1 together:
Task: "Define [tool] schemas in src/contracts/[tool].ts"
Task: "Add [tool] fixtures in tests/fixtures/[tool]/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
