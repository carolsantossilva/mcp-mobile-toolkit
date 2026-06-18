# MCP Mobile Toolkit Implementation Plan

## Goal

Build a deterministic TypeScript MCP server that converts mobile engineering
artifacts into structured triage results. Version 1 accepts inline text or JSON,
uses no network, device, filesystem, LLM, or persistent storage, and exposes
seven tools over `stdio`.

## Product decisions for v1

- Runtime: Node.js 22 or newer, TypeScript ESM with strict type checking.
- MCP transport: `stdio` only.
- Validation: Zod schemas for every public input and output.
- Tool behavior: pure and deterministic for the same normalized input.
- Input source: inline content only; file paths and URLs are out of scope.
- Public contracts reject unknown fields.
- Outputs include `schemaVersion`, `summary`, `confidence`, `evidence`, and
  `warnings`.
- Successful calls return both `structuredContent` and an equivalent JSON text
  fallback.
- Invalid arguments use MCP validation errors. Valid but insufficient inputs
  return low-confidence results with warnings.
- Unexpected errors are sanitized and never expose stack traces or input data.
- Initial language support for keyword-based classification: English and
  Portuguese, documented per rule set.
- No timestamps, random IDs, or environment-dependent values in analysis
  outputs.

### Error policy

| Condition | Behavior |
|---|---|
| Arguments do not match the input schema | MCP invalid-arguments protocol error |
| Request exceeds a documented hard limit | MCP invalid-arguments protocol error without echoing input |
| Input is valid but evidence is insufficient | Successful structured result with low confidence and warnings |
| A documented domain analysis cannot be completed | Tool result with `isError: true` and a stable sanitized error code |
| Unexpected internal failure | Tool result with `isError: true`, generic message, and no stack or input data |

### Determinism policy

Normalize line endings to LF and use Unicode NFC for matching only. Preserve
source excerpts after redaction. Trim trailing line whitespace for rule
evaluation, preserve meaningful internal whitespace, use stable array sorting,
and serialize objects through a single canonical field order. Equivalent input
means equality after those normalization steps. Byte-equivalence is required
for the canonical JSON serialization produced by the same supported runtime.

## Proposed structure

```text
src/
|-- index.ts
|-- server/
|   |-- create-server.ts
|   |-- register-tools.ts
|   `-- tool-result.ts
|-- contracts/
|   |-- common.ts
|   `-- <tool-name>.ts
|-- tools/
|   `-- <tool-name>/
|       |-- index.ts
|       |-- analyze.ts
|       |-- extract.ts
|       `-- rules.ts
`-- shared/
    |-- evidence.ts
    |-- limits.ts
    |-- redaction.ts
    |-- scoring.ts
    |-- stable-sort.ts
    `-- text.ts

tests/
|-- contract/
|-- integration/
|-- unit/
`-- fixtures/

examples/
`-- <tool-name>/
    |-- input.json
    `-- output.json
```

Tool analysis modules must not import the MCP server. The server adapts schemas
and pure analyzers to MCP; it does not own business rules.

## Shared output contract

```ts
type AnalysisMetadata = {
  schemaVersion: "1.0";
  summary: string;
  confidence: "low" | "medium" | "high";
  evidence: Array<{
    ruleId: string;
    excerpt?: string;
    source?: string;
  }>;
  warnings: string[];
};
```

All declared collection fields are always present as arrays, even when empty.
Optional scalar or object summaries use explicit availability flags when their
absence changes interpretation. Results use stable ordering. Evidence excerpts
are bounded and redacted. Confidence represents evidence quality, not severity.

Suggested initial limits:

- log or description: 250,000 characters;
- feedback batch: 500 items;
- localization keys: 10,000 entries per locale;
- evidence excerpts: 500 characters;
- generated regression scenarios: 30;
- aggregate request payload: 1 MB;
- JSON nesting depth: 20;
- synchronous analysis budget: 2 seconds in acceptance fixtures.

Limits must be constants with boundary tests so they can change without contract
drift. Regular expressions must avoid nested unbounded quantifiers and have
adversarial long-line tests to reduce ReDoS risk. Control characters other than
tab and line breaks are removed during matching.

## Delivery phases

### Phase 0 — Repository baseline

Deliver:

- Node/TypeScript package with lockfile;
- strict TypeScript, lint, formatting, Vitest, and coverage configuration;
- CI for lint, typecheck, test, and build;
- executable MCP entrypoint and package `bin`;
- sanitized example data policy;
- `SECURITY.md`;
- README installation and client configuration.

Acceptance:

- clean install succeeds from the lockfile;
- compiled server completes MCP initialization over `stdio`;
- no non-protocol output is written to `stdout`;
- CI passes on the supported Node version.

### Phase 1 — MCP foundation

Deliver:

- server factory and tool registry;
- shared schemas and enums;
- input limits, redaction, scoring, evidence, and stable sorting;
- success and error result adapters;
- private in-memory contract-test harness using the first real tool;
- compiled-process `stdio` integration test.

Acceptance:

- the minimum `analyze_build_log` contract is listed and callable through MCP;
- input and output schema validation is exercised;
- text fallback equals `structuredContent`;
- errors contain no stack trace or sensitive input.

### Phase 2 — `analyze_build_log`

Input:

- `log`;
- `platform`: `auto | android | ios | cross_platform`;
- `buildSystem`: `auto | gradle | xcodebuild | swiftpm | cocoapods |
  fastlane | flutter | react_native`;
- optional `command` and `context`.

Output:

- detected platform and build system;
- failing phase;
- primary error;
- ranked errors with category, file, line, and score;
- probable cause, relevant files, and suggested commands.

Rules cover Gradle/Kotlin/Java compilation, dependency resolution, Android
resources and manifest, Xcode signing, Swift compilation/linking, CocoaPods,
SwiftPM, Flutter/Dart, and React Native/Metro.

Acceptance:

- input/output Zod contracts, error cases, and a documented example are complete
  before the tool is registered;
- at least ten representative failure fixtures plus success, truncation, and
  multiple-error cases;
- root errors outrank generic terminal messages such as `BUILD FAILED`;
- files and commands are returned only when evidence supports them.

### Phase 3 — `triage_mobile_issue`

Input includes title, description, platform, reproduction, frequency, affected
users, regression status, workaround, and environment.

Output includes problem type, impact, `P0`–`P3` priority, platforms,
reproducibility, user journey, rationale, missing information, and next actions.

Implement a documented decision table for impact × frequency × workaround.
Words such as “urgent” never determine priority by themselves.

Acceptance:

- input/output contracts, error cases, and examples are complete before
  registration;
- security, data loss, startup failure, blocked core flow, degraded flow with a
  workaround, and cosmetic issues have explicit positive and negative tests;
- each priority includes machine-readable rationale.

### Phase 4 — `analyze_crash_log`

Input includes log, platform, optional application identifiers, context, and
symbolication status.

Output includes crash type, exception or signal, culprit frame, relevant frames,
ranked probable causes, affected area, and next steps.

Rules cover Android Java/Kotlin exceptions, `Caused by` chains, ANRs, iOS
exceptions, termination reasons, crashed threads, watchdog terminations, native
signals, and unsymbolicated/obfuscated logs.

Acceptance:

- supported inputs are Android Java/Kotlin stack traces and ANR excerpts, Apple
  `.crash`/`.ips` excerpts, and common native signal traces; Android tombstones
  are best-effort and raw binary reports are unsupported;
- contracts, failures, and examples are complete before registration;
- fixtures include Kotlin null failure, ANR, iOS exception, watchdog, native
  crash, obfuscation, and incomplete input;
- generic signals never produce an unjustified single definitive cause.

### Phase 5 — `audit_localization_keys`

Input:

- source locale;
- locale bundles containing parsed key/value entries;
- optional referenced keys.

Output:

- missing, extra, unused, and empty keys;
- placeholder mismatches;
- formatting inconsistencies;
- per-locale counts.

Support `%@`, `%d`, `%1$s`, `{name}`, and `{{name}}` placeholders. Duplicate-key
detection in raw `.strings`, XML, or ARB files is out of scope for v1.

Acceptance:

- contracts, failures, and examples are complete before registration;
- `unusedKeys` is omitted from conclusions or accompanied by a warning when
  referenced keys are unavailable;
- positional and reorderable placeholders are compared correctly;
- Unicode normalization never modifies returned source values.

### Phase 6 — `validate_release_checklist`

Input includes platforms, release type, version, build number, checks, and an
optional policy profile.

Output includes `ready | ready_with_warnings | blocked`, passed checks, warnings,
blockers, missing checks, and recommended actions.

Policies are declarative and versioned. Initial profiles cover iOS production,
Android production, cross-platform production, and hotfix releases.

Acceptance:

- contracts, failures, and examples are complete before registration;
- a missing required check differs from an explicitly failed check;
- every blocker references a policy rule;
- profile changes are testable data changes, not control-flow rewrites.

### Phase 7 — `generate_regression_test_plan`

Input includes change type, description, platforms, affected areas, risk
signals, and optional known-bug details.

Output includes risk level, coverage areas, bounded scenarios, out-of-scope
items, and assumptions. Each scenario has a stable ID, category, priority,
preconditions, steps, expected result, and automation candidacy.

Rules cover direct regression, happy path, adjacent flows, negative/error
behavior, lifecycle/background, connectivity, permissions, accessibility, and
version/device compatibility.

Acceptance:

- contracts, failures, and examples are complete before registration;
- scenario count respects the configured budget;
- selection is risk-based rather than a Cartesian product;
- IDs and ordering are stable for equivalent input.

### Phase 8 — `analyze_app_feedback`

Input includes feedback items with text and optional ID, rating, source, locale,
date, and platform, plus an optional theme limit.

Output includes multi-label themes, severity, sentiment, opportunities, example
items, urgent items, unclassified count, and optional rating summary.

Use versioned English and Portuguese lexicons for crash, performance, login,
payments, notifications, battery, accessibility, UI, and localization. Include
basic negation handling. Uncertain items remain unclassified.

Acceptance:

- contracts, failures, and examples are complete before registration;
- classification mode is explicitly multi-label;
- positive negation cases such as “não trava mais” do not count as active crash
  complaints;
- examples are redacted and bounded;
- unsupported languages lower confidence instead of producing invented themes.

### Phase 9 — Release hardening

Deliver:

- final consistency review of the per-tool examples created in each phase;
- contract, unit, and `stdio` integration tests for all tools;
- package publication checks;
- MCP Inspector smoke-test instructions;
- versioning and compatibility policy;
- full README alignment with implemented behavior.

Acceptance:

- all seven tools appear in `tools/list`;
- every output validates against its declared schema;
- equivalent fixtures produce byte-equivalent JSON;
- all rule IDs have positive or negative coverage;
- overall analyzer branch coverage is at least 90%;
- no tool accesses network, device, filesystem, or persistent state.

## Milestones

- MVP: foundation plus `analyze_build_log`, proving the complete MCP vertical
  slice used by the README demo.
- Beta: add deterministic comparison/policy tools
  (`audit_localization_keys` and `validate_release_checklist`).
- Version 1: add triage, crash analysis, regression planning, and feedback
  analysis after the shared contracts and rule framework have proven stable.

This keeps the first release surface small while preserving the seven-tool v1
roadmap.

## Test strategy

Contract tests verify tool discovery, descriptions, required and optional fields,
enums, strict unknown-field handling, validation errors, output schemas,
structured results, text fallback, and sanitized failures.

Unit tests verify each rule ID, precedence, scoring, stable sorting, redaction,
limits, Unicode, truncation, and insufficient evidence. Full-fixture snapshots
are allowed, but individual rules require explicit assertions.

Integration tests launch the compiled server, initialize an MCP client, list
tools, and call every tool over `stdio`. These tests also fail if diagnostics
leak into protocol output.

## Dependency policy

Start with the smallest runtime:

- MCP TypeScript SDK;
- Zod.

Development dependencies may include TypeScript, `tsx`, Vitest, V8 coverage,
ESLint, `typescript-eslint`, Prettier, and Node types.

Do not add NLP, logging, globbing, mobile SDK, or format-parser libraries until a
specific rule or accepted input format requires them.

## Explicitly deferred

- ADB, simulators, physical devices, XCTest execution, Detox, and Crashlytics;
- reading local files or URLs;
- LLM-backed analysis;
- raw localization-file parsing and duplicate-key detection;
- HTTP/SSE transport;
- persistence, telemetry, and remote services;
- design-system screen generation from the roadmap.
