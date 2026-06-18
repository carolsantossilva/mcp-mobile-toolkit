# Implementation Plan: Mobile Analysis Tools

**Branch**: `001-mobile-analysis-tools` | **Date**: 2026-06-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from
`/specs/001-mobile-analysis-tools/spec.md`

## Summary

Implement seven deterministic, offline mobile-analysis tools as a TypeScript
MCP server distributed as a compiled CLI. Each tool has a strict versioned
input/output contract, returns validated structured content plus a canonical
JSON text fallback, and delegates analysis to pure rule modules isolated from
the MCP transport. Delivery starts with the complete `analyze_build_log`
vertical slice, then deterministic localization and release-policy tools, and
finally the higher-uncertainty triage, crash, regression, and feedback tools.

## Technical Context

**Language/Version**: TypeScript 5.x, strict ESM; Node.js 24 reference runtime
with Node.js 22 as the minimum supported runtime

**Primary Dependencies**: `@modelcontextprotocol/sdk` 1.29.x, Zod 4; Vitest 4,
TypeScript, ESLint, `typescript-eslint`, Prettier, `tsx`, Node types, and V8
coverage for development

**Storage**: N/A. Runtime is stateless and does not persist artifacts, results,
logs, or telemetry.

**Testing**: Vitest unit and contract suites, adversarial fixture suites, and
compiled-process MCP integration tests over `stdio`; CI matrix on Node 22 and 24

**Target Platform**: Local MCP hosts on Windows, Linux, and macOS with Node.js
22 or 24; analysis covers documented Android, Apple, and cross-platform text or
structured artifacts

**Project Type**: Single-package MCP server and npm CLI

**Performance Goals**: Accepted maximum-size inputs complete deterministic
analysis within two seconds on the documented Node 24 reference environment;
generated regression plans contain at most 30 scenarios

**Constraints**: Offline and stateless; `stdio` only; no device, filesystem,
network, external-model, or environment-variable access from analyzers;
`stdout` reserved for MCP framing; strict public schemas; bounded UTF-8 payload
and collection sizes; redaction before evidence or errors; stable ordering and
canonical JSON fallback

**Scale/Scope**: Seven tools; payload up to 1 MiB subject to tighter field
limits; logs up to 250,000 JavaScript characters; up to 500 feedback items,
50 locale bundles, 100,000 total localization entries, 500 release checks, and
50 evidence items per result

**Architecture Decisions**:
[ADR 0001](../../docs/adr/0001-runtime-and-mcp-sdk.md),
[ADR 0002](../../docs/adr/0002-stdio-only-transport.md),
[ADR 0003](../../docs/adr/0003-separate-protocol-from-analysis.md),
[ADR 0004](../../docs/adr/0004-versioned-structured-contracts.md), and
[ADR 0005](../../docs/adr/0005-deterministic-offline-processing.md)

## Constitution Check

*GATE: Passed before Phase 0 research and re-checked after Phase 1 design.*

- **MCP Contract Fidelity — PASS**: Seven named contracts are documented under
  `contracts/`. Every successful call declares an output schema and returns the
  same result through structured content and canonical JSON text. Validation,
  domain, and internal error behavior is explicit.
- **Mobile Platform Reality — PASS**: Supported input formats are documented per
  tool. Version 1 analyzes supplied artifacts only; device state, simulators,
  emulators, physical devices, ADB, XCTest execution, and Crashlytics access are
  explicitly unsupported.
- **Testable Behavior First — PASS**: Each user story has an independent test.
  Every tool requires contract, rule, boundary, and representative fixture
  coverage before registration. The compiled `stdio` boundary has integration
  tests.
- **Security and User Consent Boundaries — PASS**: Runtime retention is zero.
  Inputs may contain sensitive logs and identifiers, so limits and redaction
  occur before evidence or errors. No raw input, stack trace, secret, or
  personal path is logged or persisted.
- **Observable Minimal Integration — PASS**: Runtime dependencies are limited
  to the MCP SDK and Zod. Diagnostics use stable codes, warnings, confidence,
  and evidence. No service, database, HTTP listener, telemetry, or persistent
  process is added.

### Post-design re-check

The data model and contracts preserve all gates. Shared abstractions are limited
to schemas, result adaptation, validation, redaction, deterministic ordering,
and proven cross-tool concepts. Tool-specific taxonomies and rules remain
inside each tool module.

## Project Structure

### Documentation (this feature)

```text
specs/001-mobile-analysis-tools/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- common.md
|   `-- tools.md
|-- checklists/
|   `-- requirements.md
`-- tasks.md
```

`tasks.md` is generated later by `speckit-tasks`.

### Source Code (repository root)

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
    |-- canonical-json.ts
    |-- evidence.ts
    |-- limits.ts
    |-- redaction.ts
    |-- stable-sort.ts
    `-- text.ts

tests/
|-- contract/
|-- integration/
|-- unit/
`-- fixtures/
    |-- build/
    |-- crash/
    |-- feedback/
    |-- issues/
    |-- localization/
    |-- regression/
    `-- release/

examples/
`-- <tool-name>/
    |-- input.json
    `-- output.json
```

**Structure Decision**: Use one npm package. MCP SDK imports are confined to
`src/server/` and tool registration adapters. Pure analyzers depend on contract
types and shared deterministic utilities but never on the transport. Public Zod
schemas are separate from normalized internal values.

## Delivery Order

1. Repository and package baseline.
2. MCP server, shared result adapter, limits, redaction, canonical JSON, and
   contract/integration harness.
3. `analyze_build_log` complete vertical slice.
4. `audit_localization_keys`.
5. `validate_release_checklist`.
6. `triage_mobile_issue`.
7. `analyze_crash_log`.
8. `generate_regression_test_plan`.
9. `analyze_app_feedback`.
10. Packaging, complete `stdio` conformance, examples, and release hardening.

Each tool is added to `tools/list` only when its contract, examples, rules,
limits, and required tests are complete.

## Complexity Tracking

No constitution violations require exceptions.
