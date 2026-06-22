# Tasks: Mobile Analysis Tools

**Input**: Design documents from `/specs/001-mobile-analysis-tools/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`

**Tests**: Required by the constitution and feature specification. Contract tests are mandatory for every MCP-visible tool. The
compiled `stdio` process requires integration coverage.

**Organization**: Tasks are grouped by user story so each story produces an independently testable increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it changes different files and does not depend on another incomplete task in the same
  phase.
- **[Story]**: Maps a task to a user story from `spec.md`.
- Every task includes an exact file or directory path.

## Phase 1: Setup

**Purpose**: Establish the package, build, quality, and publication baseline.

- [x] T001 Create the npm package metadata, scripts, ESM `bin`, Node engine, and publication file list in `package.json`
- [x] T002 Generate and commit the npm dependency lockfile in `package-lock.json`
- [x] T003 [P] Configure strict NodeNext TypeScript compilation in `tsconfig.json`
- [x] T004 [P] Configure Vitest projects and V8 coverage in `vitest.config.ts`
- [x] T005 [P] Configure ESLint with TypeScript rules in `eslint.config.js`
- [x] T006 [P] Configure formatting and generated-artifact exclusions in `.prettierrc.json` and `.prettierignore`
- [x] T007 [P] Add Node 22/24 lint, typecheck, test, build, and package CI jobs in `.github/workflows/ci.yml`
- [x] T008 [P] Document vulnerability reporting and sensitive fixture policy in `SECURITY.md`
- [x] T009 Create the initial executable and test-helper entry files in `src/index.ts` and `tests/helpers/index.ts`

**Checkpoint**: The repository has a reproducible Node/TypeScript toolchain and CI definition.

---

## Phase 2: Foundational

**Purpose**: Implement the blocking MCP, contract, determinism, and security infrastructure shared by all user stories.

**CRITICAL**: No user-story tool may be registered before this phase completes.

- [x] T010 Define shared strict Zod schemas for versions, confidence, warnings, evidence, unavailable values, actions, and errors
      in `src/contracts/common.ts`
- [x] T011 [P] Define public platform, locale, release, severity, and priority enums in `src/contracts/taxonomies.ts`
- [x] T012 [P] Implement UTF-8 byte, character, line, collection, and nesting limits in `src/shared/limits.ts`
- [x] T013 [P] Implement LF/NFC matching normalization while preserving returned source text in `src/shared/text.ts`
- [x] T014 [P] Implement token, e-mail, personal-path, identifier, and secret redaction in `src/shared/redaction.ts`
- [x] T015 [P] Implement total comparators and stable array ordering in `src/shared/stable-sort.ts`
- [x] T016 [P] Implement RFC 8785-aligned canonical JSON serialization in `src/shared/canonical-json.ts`
- [x] T017 [P] Implement stable rule and occurrence IDs plus typed evidence construction in `src/shared/evidence.ts`
- [x] T018 Implement successful structured/text result adaptation and sanitized `isError` results in `src/server/tool-result.ts`
- [x] T019 Implement the MCP server factory and `stdio` transport wiring in `src/server/create-server.ts` and `src/index.ts`
- [x] T020 Implement deferred tool registration so incomplete tools do not appear in `tools/list` in
      `src/server/register-tools.ts`
- [x] T021 [P] Add unit tests for limits, normalization, ordering, canonical JSON, IDs, and redaction in `tests/unit/shared/`,
      plus import-boundary enforcement in `tests/unit/architecture/import-boundaries.test.ts`
- [x] T022 [P] Add shared schema and error contract tests in `tests/contract/common-contract.test.ts`
- [x] T023 Add an in-memory MCP client/server test harness in `tests/helpers/mcp-harness.ts`
- [x] T024 Add a compiled-process `stdio` harness that rejects non-protocol `stdout` bytes in `tests/helpers/stdio-harness.ts`

**Checkpoint**: Shared contracts and a server with no public analysis tools are testable without network, filesystem access from
analyzers, or persistent state.

---

## Phase 3: User Story 1 — Diagnose a Mobile Build Failure (P1) MVP

**Goal**: Deliver the complete `analyze_build_log` vertical slice for Android, Apple, and documented cross-platform build logs.

**Independent Test**: Start the compiled server, discover `analyze_build_log`, submit representative Gradle and Xcode build
failures, and verify that causal errors outrank terminal summaries while incomplete logs return low-confidence warnings.

### Tests for User Story 1

- [ ] T025 [P] [US1] Add discovery, description, strict input/output schema, documented-limit, and error contract tests for
      `analyze_build_log` in `tests/contract/analyze-build-log.test.ts`
- [ ] T026 [P] [US1] Add sanitized Gradle, Kotlin, Android resource, manifest, dependency, and multi-error fixtures in
      `tests/fixtures/build/android/`
- [ ] T027 [P] [US1] Add sanitized Xcodebuild, Swift, signing, provisioning, linker, CocoaPods, SwiftPM, and multi-error fixtures
      in `tests/fixtures/build/ios/`
- [ ] T028 [P] [US1] Add Flutter, React Native, Fastlane, auto-detection, unsupported-format, success, incomplete,
      oversized-input, oversized-line, and adversarial regex fixtures in `tests/fixtures/build/cross-platform/`
- [ ] T029 [US1] Add a traceable rule-ID matrix with positive/negative cases, precedence, redaction, all applicable
      field/payload/evidence limits, stable ordering, and insufficient-evidence tests in
      `tests/unit/tools/analyze-build-log.test.ts`
- [ ] T030 [US1] Write the initially failing compiled `stdio` discovery and invocation tests in
      `tests/integration/analyze-build-log-stdio.test.ts`

### Implementation for User Story 1

- [ ] T031 [P] [US1] Define strict schemas and build taxonomies in `src/contracts/analyze-build-log.ts`
- [ ] T032 [P] [US1] Define versioned build-system rules and allowlisted next actions in `src/tools/analyze-build-log/rules.ts`
- [ ] T033 [US1] Implement platform, build-system, phase, file, line, and error extraction in
      `src/tools/analyze-build-log/extract.ts`
- [ ] T034 [US1] Implement finding scoring, causal-error precedence, confidence, and result assembly in
      `src/tools/analyze-build-log/analyze.ts`
- [ ] T035 [US1] Register `analyze_build_log` with its input/output schemas in `src/tools/analyze-build-log/index.ts` and
      `src/server/register-tools.ts`, then make `tests/integration/analyze-build-log-stdio.test.ts` pass
- [ ] T036 [US1] Add documented input/output examples in `examples/analyze-build-log/input.json` and
      `examples/analyze-build-log/output.json`, and align the build-log demo in `README.md`

**Checkpoint**: The README demonstration is executable as an independently testable MCP tool.

---

## Phase 4: User Story 2 — Audit Deterministic Release Artifacts (P2)

**Goal**: Deliver independently callable localization auditing and release checklist validation with deterministic ordering and
policy resolution.

**Independent Test**: Invoke each tool with known key differences and release check states; verify exact findings,
missing-versus-failed distinctions, and equivalent results for reordered inputs.

### Tests for User Story 2

- [ ] T037 [P] [US2] Add discovery, description, strict input/output schema, documented-limit, and error contract tests for
      `audit_localization_keys` in `tests/contract/audit-localization-keys.test.ts`
- [ ] T038 [P] [US2] Add missing, extra, unused, empty, referenced-key, whitespace, line-break, typed/positional placeholder,
      Unicode collision, reordered-input, and applicable boundary fixtures in `tests/fixtures/localization/`
- [ ] T039 [P] [US2] Add discovery, description, strict input/output schema, documented-limit, and error contract tests for
      `validate_release_checklist` in `tests/contract/validate-release-checklist.test.ts`
- [ ] T040 [P] [US2] Add Android, iOS, cross-platform, hotfix, duplicate-ID, missing, failed, warning, and unknown-check fixtures
      in `tests/fixtures/release/`
- [ ] T041 [US2] Add a traceable localization rule-ID matrix with positive/negative cases for every finding type, applicable
      limits, ordering, collisions, and unused-analysis availability in `tests/unit/tools/audit-localization-keys.test.ts`
- [ ] T042 [US2] Add a traceable release rule/policy matrix with every decision branch, applicable limits, precedence,
      missing-versus-not-run, and resolved-policy tests in `tests/unit/tools/validate-release-checklist.test.ts`
- [ ] T043 [US2] Write the initially failing compiled `stdio` coverage for both deterministic release tools in
      `tests/integration/release-artifacts-stdio.test.ts`

### Implementation for User Story 2

- [ ] T044 [P] [US2] Define strict localization input/output schemas in `src/contracts/audit-localization-keys.ts`
- [ ] T045 [P] [US2] Define placeholder tokenization and finding rules in `src/tools/audit-localization-keys/rules.ts`
- [ ] T046 [US2] Implement locale identity, key comparison, placeholder extraction, collision detection, and deterministic
      findings in `src/tools/audit-localization-keys/analyze.ts`
- [ ] T047 [US2] Register `audit_localization_keys` in `src/tools/audit-localization-keys/index.ts` and
      `src/server/register-tools.ts`
- [ ] T048 [P] [US2] Define strict release checklist input/output schemas in `src/contracts/validate-release-checklist.ts`
- [ ] T049 [P] [US2] Define immutable Android, iOS, cross-platform, and hotfix profiles in
      `src/tools/validate-release-checklist/policies.ts`
- [ ] T050 [US2] Implement policy resolution, check classification, blockers, decisions, and recommended actions in
      `src/tools/validate-release-checklist/analyze.ts`
- [ ] T051 [US2] Register `validate_release_checklist` in `src/tools/validate-release-checklist/index.ts` and
      `src/server/register-tools.ts`, then make `tests/integration/release-artifacts-stdio.test.ts` pass
- [ ] T052 [P] [US2] Add localization examples in `examples/audit-localization-keys/input.json` and
      `examples/audit-localization-keys/output.json`
- [ ] T053 [P] [US2] Add release checklist examples in `examples/validate-release-checklist/input.json` and
      `examples/validate-release-checklist/output.json`

**Checkpoint**: Both tools are independently callable and require no build-log analysis state.

---

## Phase 5: User Story 3 — Triage Mobile Incidents and Crashes (P3)

**Goal**: Deliver reproducible issue priority decisions and platform-aware crash analysis without overstating incomplete evidence.

**Independent Test**: Invoke issue triage and crash analysis with documented Android and Apple fixtures; verify decision-matrix
rationale, root exception selection, application-frame precedence, and reduced confidence for unsymbolicated data.

### Tests for User Story 3

- [ ] T054 [P] [US3] Add discovery, description, strict input/output schema, documented-limit, and error contract tests for
      `triage_mobile_issue` in `tests/contract/triage-mobile-issue.test.ts`
- [ ] T055 [P] [US3] Add security, data-loss, startup, core-flow, workaround, cosmetic, urgency-language, and incomplete issue
      fixtures in `tests/fixtures/issues/`
- [ ] T056 [P] [US3] Add discovery, description, strict input/output schema, documented-limit, and error contract tests for
      `analyze_crash_log` in `tests/contract/analyze-crash-log.test.ts`
- [ ] T057 [P] [US3] Add Android exception-chain, ANR, tombstone, obfuscated, and incomplete fixtures in
      `tests/fixtures/crash/android/`
- [ ] T058 [P] [US3] Add Apple `.crash`, `.ips`, `native_trace`, watchdog, native signal, auto-detection, unsupported/incompatible
      format, unsymbolicated, incomplete, and applicable boundary fixtures in `tests/fixtures/crash/ios/`
- [ ] T059 [US3] Add a traceable issue rule-ID matrix covering every priority decision branch, positive/negative cases, applicable
      limits, and missing-information behavior in `tests/unit/tools/triage-mobile-issue.test.ts`
- [ ] T060 [US3] Add a traceable crash rule-ID matrix covering parsing, positive/negative matches, frame precedence,
      symbolication, cause ranking, applicable limits, and confidence in `tests/unit/tools/analyze-crash-log.test.ts`
- [ ] T061 [US3] Write the initially failing compiled `stdio` coverage for issue and crash tools in
      `tests/integration/incident-triage-stdio.test.ts`

### Implementation for User Story 3

- [ ] T062 [P] [US3] Define strict issue triage schemas and taxonomies in `src/contracts/triage-mobile-issue.ts`
- [ ] T063 [P] [US3] Define the impact, scope, frequency, workaround, and priority matrix in
      `src/tools/triage-mobile-issue/rules.ts`
- [ ] T064 [US3] Implement normalized fact extraction, classification, rationale, missing information, and actions in
      `src/tools/triage-mobile-issue/analyze.ts`
- [ ] T065 [US3] Register `triage_mobile_issue` in `src/tools/triage-mobile-issue/index.ts` and `src/server/register-tools.ts`
- [ ] T066 [P] [US3] Define strict crash input/output schemas and format taxonomies in `src/contracts/analyze-crash-log.ts`
- [ ] T067 [P] [US3] Define Android, Apple, ANR/watchdog, native, symbolication, and framework rules in
      `src/tools/analyze-crash-log/rules.ts`
- [ ] T068 [US3] Implement exception-chain, thread, frame, signal, and application-identifier extraction in
      `src/tools/analyze-crash-log/extract.ts`
- [ ] T069 [US3] Implement cause ranking, culprit selection, affected area, confidence, and next actions in
      `src/tools/analyze-crash-log/analyze.ts`
- [ ] T070 [US3] Register `analyze_crash_log` in `src/tools/analyze-crash-log/index.ts` and `src/server/register-tools.ts`, then
      make `tests/integration/incident-triage-stdio.test.ts` pass
- [ ] T071 [P] [US3] Add issue triage examples in `examples/triage-mobile-issue/input.json` and
      `examples/triage-mobile-issue/output.json`
- [ ] T072 [P] [US3] Add crash analysis examples in `examples/analyze-crash-log/input.json` and
      `examples/analyze-crash-log/output.json`

**Checkpoint**: Both incident tools are independently usable and expose evidence-backed uncertainty.

---

## Phase 6: User Story 4 — Generate Focused Regression Coverage (P4)

**Goal**: Generate bounded, catalog-backed regression scenarios ordered by risk.

**Independent Test**: Submit a payment bug fix and a cosmetic change; verify direct regression coverage, proportional risk, stable
scenario IDs, and the configured scenario budget.

### Tests for User Story 4

- [ ] T073 [P] [US4] Add discovery, description, strict input/output schema, documented-limit, and error contract tests for
      `generate_regression_test_plan` in `tests/contract/generate-regression-test-plan.test.ts`
- [ ] T074 [P] [US4] Add bug-fix, feature, dependency, refactor, configuration, release, high-risk, low-risk, and budget fixtures
      in `tests/fixtures/regression/`
- [ ] T075 [US4] Add a traceable catalog/rule-ID matrix with positive/negative cases, all category quotas, applicable limits,
      ordering, collisions, and stable IDs in `tests/unit/tools/generate-regression-test-plan.test.ts`
- [ ] T076 [US4] Write the initially failing compiled `stdio` discovery and invocation tests in
      `tests/integration/regression-plan-stdio.test.ts`

### Implementation for User Story 4

- [ ] T077 [P] [US4] Define strict regression plan schemas and taxonomies in `src/contracts/generate-regression-test-plan.ts`
- [ ] T078 [P] [US4] Define versioned scenario templates and stable catalog IDs in
      `src/tools/generate-regression-test-plan/catalog.ts`
- [ ] T079 [US4] Implement risk classification, category quotas, bounded selection, assumptions, and out-of-scope reporting in
      `src/tools/generate-regression-test-plan/analyze.ts`
- [ ] T080 [US4] Register `generate_regression_test_plan` in `src/tools/generate-regression-test-plan/index.ts` and
      `src/server/register-tools.ts`, then make `tests/integration/regression-plan-stdio.test.ts` pass
- [ ] T081 [US4] Add documented examples in `examples/generate-regression-test-plan/input.json` and
      `examples/generate-regression-test-plan/output.json`

**Checkpoint**: Regression plans are deterministic and never exceed 30 scenarios.

---

## Phase 7: User Story 5 — Summarize App Feedback Themes (P5)

**Goal**: Classify English and Portuguese feedback into bounded canonical multi-label themes while preserving explicit
uncertainty.

**Independent Test**: Submit feedback containing crash/login complaints, positive negation, ambiguous items, and
unsupported-language items; verify multi-label counts, negation behavior, evidence, and unclassified outcomes.

### Tests for User Story 5

- [ ] T082 [P] [US5] Add discovery, description, strict input/output schema, documented-limit, and error contract tests for
      `analyze_app_feedback` in `tests/contract/analyze-app-feedback.test.ts`
- [ ] T083 [P] [US5] Add English, Portuguese, negation, multi-label, rating, unsupported-language, ambiguous, oversized, and
      adversarial fixtures in `tests/fixtures/feedback/`
- [ ] T084 [US5] Add a traceable feedback rule-ID matrix with positive/negative lexicon matches, negation windows, multi-label,
      severity, sentiment, every applicable limit, and ordering in `tests/unit/tools/analyze-app-feedback.test.ts`
- [ ] T085 [US5] Write the initially failing compiled `stdio` discovery and invocation tests in
      `tests/integration/app-feedback-stdio.test.ts`

### Implementation for User Story 5

- [ ] T086 [P] [US5] Define strict feedback input/output schemas and canonical theme taxonomies in
      `src/contracts/analyze-app-feedback.ts`
- [ ] T087 [P] [US5] Define versioned English and Portuguese theme lexicons and negation rules in
      `src/tools/analyze-app-feedback/rules.ts`
- [ ] T088 [US5] Implement locale handling, bounded matching, multi-label classification, severity, sentiment, urgent items, and
      opportunities in `src/tools/analyze-app-feedback/analyze.ts`
- [ ] T089 [US5] Register `analyze_app_feedback` in `src/tools/analyze-app-feedback/index.ts` and `src/server/register-tools.ts`,
      then make `tests/integration/app-feedback-stdio.test.ts` pass
- [ ] T090 [US5] Add documented examples in `examples/analyze-app-feedback/input.json` and
      `examples/analyze-app-feedback/output.json`

**Checkpoint**: All seven planned tools are complete and independently testable.

---

## Phase 8: Polish and Cross-Cutting Validation

**Purpose**: Verify the complete package, contracts, security, performance, and documentation after all selected stories are
implemented.

- [ ] T091 [P] Add a complete seven-tool discovery suite validating each name, description, strict input/output schema, documented
      limits, structured/text equivalence, and failure behavior in `tests/contract/all-tools-conformance.test.ts`
- [ ] T092 [P] Add synthetic secret, path, identifier, and error-leak regression coverage in
      `tests/unit/security/redaction-regression.test.ts`
- [ ] T093 [P] Add cross-tool repeated-run determinism for reordered input, LF/CRLF, NFC-equivalent matching, and canonical JSON
      plus maximum-size/two-second reference checks in `tests/integration/determinism-performance.test.ts`
- [ ] T094 Add end-to-end compiled `stdio` calls for all seven tools and assert clean `stdout` in
      `tests/integration/all-tools-stdio.test.ts`
- [ ] T095 Add package tarball build, install, executable, and file-content smoke tests in
      `tests/integration/package-smoke.test.ts`
- [ ] T096 [P] Update installation, client configuration, supported formats, limits, errors, and examples in `README.md`
- [ ] T097 [P] Document rule-set, schema, policy, and compatibility versioning in `docs/versioning.md`
- [ ] T098 Validate every command and checkpoint in `specs/001-mobile-analysis-tools/quickstart.md`
- [ ] T099 Run lint, typecheck, unit, contract, integration, coverage, build, and `npm pack --dry-run`, recording any intentional
      exceptions in `specs/001-mobile-analysis-tools/plan.md`

---

## Dependencies and Execution Order

### Phase dependencies

- **Setup** has no dependencies.
- **Foundational** depends on Setup and blocks all user stories.
- **US1** depends only on Foundational and is the MVP.
- **US2** depends on US1, **US3** depends on US2, **US4** depends on US3, and **US5** depends on US4 because every phase composes
  new definitions into `src/server/register-tools.ts`. Runtime behavior remains independently testable, but implementation is
  sequential to avoid shared-file conflicts.
- **Polish** depends on every story selected for the release.

### User-story dependency graph

```text
Setup
  -> Foundational
      -> US1 Build diagnosis (MVP)
          -> US2 Release artifacts
              -> US3 Incident and crash triage
                  -> US4 Regression planning
                      -> US5 Feedback themes

US1 + US2 + US3 + US4 + US5
  -> Polish and release validation
```

No user story consumes another story's runtime output. The sequential implementation dependency exists only because the server
registry is a shared composition point.

### Within each tool

1. Write contract and fixture tests.
2. Define public schemas and rule/catalog data.
3. Implement extraction and analysis.
4. Register the tool only after its required tests pass.
5. Add integration coverage and examples.

## Parallel Execution Examples

### User Story 1

```text
Parallel:
- T025 contract tests
- T026 Android fixtures
- T027 iOS fixtures
- T028 cross-platform/adversarial fixtures
- T030 initially failing `stdio` test
- T031 public schemas
- T032 rule catalog

Then:
T029 -> T033 -> T034 -> T035 (integration passes) -> T036
```

### User Story 2

```text
Localization stream:
T037 + T038 + T044 + T045 -> T041 -> T046 -> T047 -> T052

Release stream:
T039 + T040 + T048 + T049 -> T042 -> T050 -> T051 -> T053

Start T043 as an initially failing integration test; both streams complete at
T051, which makes T043 pass.
```

### User Story 3

```text
Issue stream:
T054 + T055 + T062 + T063 -> T059 -> T064 -> T065 -> T071

Crash stream:
T056 + T057 + T058 + T066 + T067 -> T060 -> T068 -> T069 -> T070 -> T072

Start T061 as an initially failing integration test; both streams complete at
T070, which makes T061 pass.
```

### User Story 4

```text
T073 + T074 + T076 + T077 + T078 -> T075 -> T079 -> T080
(integration passes) -> T081
```

### User Story 5

```text
T082 + T083 + T085 + T086 + T087 -> T084 -> T088 -> T089
(integration passes) -> T090
```

## Implementation Strategy

### MVP first

1. Complete T001–T024.
2. Complete T025–T036.
3. Stop and validate `analyze_build_log` through the compiled MCP process.
4. Demonstrate the README use case before expanding the public tool list.

### Incremental delivery

1. Add US2 for deterministic release artifact analysis.
2. Add US3 for incident and crash triage.
3. Add US4 for risk-based regression planning.
4. Add US5 for bounded feedback classification.
5. Complete T091–T099 before version 1 release.

### Commit boundaries

- Commit Setup and Foundational configuration separately.
- For each tool, prefer separate commits for contracts/tests, rules/analyzer, registration/integration, and examples/docs.
- Never register a partially tested tool in `tools/list`.
