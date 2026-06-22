# mcp-mobile-toolkit

`mcp-mobile-toolkit` is a TypeScript MCP server for automating repetitive
mobile engineering triage work.

> **Status:** pre-alpha planning. The MCP server and tools described below are
> planned and are not implemented yet. See the formal
> [Spec Kit implementation plan](specs/001-mobile-analysis-tools/plan.md) and the
> [implementation plan](docs/implementation-plan.md) plus the
> [repository review](docs/repository-review.md).

Mobile teams spend a lot of time reading noisy crash logs, build failures,
release notes, feedback, localization files, and bug reports before deciding
what to do next. This project turns those repeated analysis workflows into
structured MCP tools that can be called from AI clients and developer
automation.

## Planned architecture

```text
MCP client
  -> mcp-mobile-toolkit server
    -> tool input validation with Zod
    -> mobile-focused analysis tools
    -> structured tool responses
```

The server owns the MCP contract, validates tool inputs with Zod, and returns
structured outputs that are easy for clients to render, summarize, or chain into
follow-up actions.

## Planned scope v1

- TypeScript MCP server for mobile workflows
- Mock data and sample inputs in `examples/`
- Validation with Zod
- Tests with Vitest
- CI for lint, typecheck, and test

## Planned tools

### `analyze_crash_log`

Analyzes mobile stack traces and suggests the probable cause, affected area,
and next steps.

### `analyze_build_log`

Summarizes build failures, identifies the main errors, and points to relevant
files or commands.

### `analyze_app_feedback`

Groups reviews, support tickets, or user feedback into themes, severity, and
opportunities.

### `triage_mobile_issue`

Classifies a mobile issue by impact, priority, platform, and problem type.

### `generate_regression_test_plan`

Generates regression scenarios from a bug, feature, release change, or fix.

### `validate_release_checklist`

Checks whether a mobile release meets minimum criteria before publication.

### `audit_localization_keys`

Finds missing, unused, or inconsistent localization keys across languages.

## Demo

Prompt:

```text
Use analyze_build_log to review this Android CI failure and tell me the likely
root cause, affected files, and next commands to run.
```

Example output:

```json
{
  "schemaVersion": "1.0",
  "summary": "The build fails during Kotlin compilation because a renamed API is still referenced by the checkout screen.",
  "confidence": "high",
  "severity": "high",
  "probableCause": "CartRepository.getActiveCart was removed or renamed, but CheckoutViewModel still imports it.",
  "affectedArea": "Android checkout flow",
  "relevantFiles": [
    "android/app/src/main/java/com/example/checkout/CheckoutViewModel.kt"
  ],
  "nextSteps": [
    "Confirm the replacement repository method",
    "Update CheckoutViewModel imports and call sites",
    "Run the Android unit tests for checkout"
  ],
  "evidence": [
    {
      "ruleId": "android.kotlin.unresolved-reference",
      "source": "build-log"
    }
  ],
  "warnings": []
}
```

## Roadmap

Near-term tool ideas:

- `compare_release_notes`: compare releases and highlight user-facing changes,
  risks, and possible impact.
- `detect_flaky_test_patterns`: identify unstable tests from history, logs, or
  recurring failures.
- `audit_app_store_metadata`: review title, description, keywords, and
  screenshots for release consistency.
- Design-system screen generator: create a mobile screen from existing design
  system components.

Future integrations:

- ADB
- XCTest logs
- Detox
- Firebase Crashlytics

## Repository Topics

`mcp`, `model-context-protocol`, `typescript`, `mobile-development`,
`ai-tools`, `developer-tools`, `automation`
