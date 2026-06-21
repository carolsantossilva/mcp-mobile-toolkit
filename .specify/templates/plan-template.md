# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [default: TypeScript; include Node.js version or NEEDS CLARIFICATION]

**Primary Dependencies**: [e.g., MCP SDK, Zod, Vitest or NEEDS CLARIFICATION]

**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]

**Testing**: [default: Vitest; include contract/integration strategy or NEEDS CLARIFICATION]

**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]

**Project Type**: [e.g., MCP server, library, CLI, mobile integration or NEEDS CLARIFICATION]

**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **MCP Contract Fidelity**: Identify changed tool names, schemas, inputs,
  outputs, error shapes, and capability descriptions. Contract validation is
  required for every protocol-facing change.
- **Mobile Platform Reality**: State target platforms and whether behavior
  applies to iOS, Android, simulators, emulators, physical devices, or a subset.
  Document unsupported platform behavior explicitly.
- **Testable Behavior First**: Link each user-visible capability to an
  independently testable scenario. Require MCP contract tests for protocol
  changes and integration tests for process, device, simulator, or network
  boundaries.
- **Security and User Consent Boundaries**: Identify secrets, device data, logs,
  screenshots, recordings, tokens, and permission-sensitive actions. State how
  each is minimized, redacted, or protected.
- **Observable Minimal Integration**: Define diagnostics for failure cases and
  justify any added service, process, dependency, or persistent state.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── index.ts
├── server/
├── contracts/
├── tools/
│   └── [tool-name]/
└── shared/

tests/
├── contract/
├── integration/
├── unit/
└── fixtures/

examples/
└── [tool-name]/
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
