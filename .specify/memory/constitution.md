<!--
Sync Impact Report
Version change: 1.1.0 -> 1.1.1
Modified principles:
- II. Mobile Platform Reality: scoped device-runtime requirements to device-facing integrations
Added sections:
- None
Removed sections:
- None
Templates requiring updates:
- updated .specify/templates/plan-template.md
- updated .specify/templates/spec-template.md
- updated .specify/templates/tasks-template.md
- pending .specify/templates/commands/*.md not present in this scaffold
Follow-up TODOs:
- None
-->
# MCP Mobile Toolkit Constitution

## Core Principles

### I. MCP Contract Fidelity
Every feature MUST preserve Model Context Protocol compatibility at the boundary.
Tool names, schemas, inputs, outputs, error shapes, and capability descriptions
MUST be explicit, version-aware, and covered by contract validation before they
are exposed to clients.

Rationale: mobile automation clients depend on stable protocol behavior more
than internal implementation details.

### II. Mobile Platform Reality
Features MUST model the mobile constraints relevant to their scope. Artifact
analysis tools MUST state which platforms and input formats they understand.
Device-facing integrations MUST additionally address device state, permissions,
latency, connectivity, and simulator or emulator versus physical-device
behavior. Plans MUST state intentionally unsupported behavior.

Rationale: analysis must reflect real platform formats without forcing
device-runtime concerns onto tools that only inspect supplied artifacts.

### III. Testable Behavior First
Each user-visible capability MUST include an independently testable scenario
before implementation work is considered complete. MCP contract tests are
REQUIRED for protocol changes, and integration tests are REQUIRED for workflows
that cross process, device, simulator, or network boundaries.

Rationale: this toolkit coordinates external systems, so regressions usually
appear at boundaries rather than in isolated helper code.

### IV. Security and User Consent Boundaries
The toolkit MUST minimize privileges, avoid hidden data capture, and make
dangerous or user-impacting actions explicit. Secrets, device identifiers,
tokens, logs, screenshots, recordings, and user data MUST be protected from
accidental persistence or disclosure.

Rationale: mobile tooling can touch sensitive device and application state, so
trust boundaries must be designed in rather than patched later.

### V. Observable Minimal Integration
Features MUST expose actionable diagnostics for failures without leaking
sensitive data. As a personal technical project, implementations SHOULD prefer
the smallest integration surface that satisfies the feature and MUST justify
additional services, processes, or persistent state in the plan.

Rationale: concise diagnostics make remote tool failures debuggable, while
minimal integration keeps the toolkit maintainable.

## Technical Standards

The default implementation language is TypeScript. Plans MAY propose another
language only when required by a platform integration, SDK limitation, or clear
maintenance benefit. Runtime, dependency, target platform, and testing choices
MUST be documented before implementation.

Public MCP contracts MUST include schema examples and failure behavior.
Platform-specific code MUST be isolated behind clear interfaces when behavior
differs across iOS, Android, simulator, emulator, or physical devices.

Dependencies that affect protocol behavior, device communication, security, or
test execution MUST be justified in research or the implementation plan. Any
storage of artifacts, logs, credentials, or device data MUST state retention and
redaction expectations.

## Delivery Workflow

Specifications MUST define independently testable user stories, edge cases, and
measurable success criteria. Plans MUST pass the Constitution Check before Phase
0 research and again after Phase 1 design. Tasks MUST be grouped by user story,
include contract or integration tests where required by these principles, and
preserve traceability from requirements to implementation.

Implementation reviews MUST verify protocol compatibility, platform scope, test
coverage, security boundaries, and diagnostic behavior before feature work is
considered complete. This review can be a pull request, a local review, or a
documented self-review for personal work.

## Governance

This constitution supersedes conflicting repository guidance for specification,
planning, task generation, and implementation. Amendments require a documented
change to this file, a Sync Impact Report, and updates to affected templates or
runtime guidance in the same change set.

Versioning follows semantic versioning. MAJOR changes remove or redefine
principles in a backward-incompatible way. MINOR changes add principles,
sections, or materially expanded governance. PATCH changes clarify wording,
fix errors, or make non-semantic refinements.

Compliance is reviewed during planning, task generation, and code review. Any
approved exception MUST be recorded in the plan's Complexity Tracking table with
the simpler alternative that was rejected.

**Version**: 1.1.1 | **Ratified**: 2026-05-31 | **Last Amended**: 2026-06-18
