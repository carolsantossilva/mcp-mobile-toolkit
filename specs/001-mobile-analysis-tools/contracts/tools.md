# Tool Contracts

All tools use the envelope and behavior in [common.md](common.md). Public object schemas are strict.

## `analyze_build_log`

Input:

- `log`: required string, 1–250,000 characters;
- `platform`: `auto | android | ios | cross_platform`, default `auto`;
- `buildSystem`: `auto | gradle | xcodebuild | swiftpm | cocoapods | fastlane | flutter | react_native`, default `auto`;
- `command`: optional string, maximum 20,000 characters;
- `context`: optional string, maximum 20,000 characters.

`data` contains detected platform/build system with confidence, failing phase, primary finding or unavailable reason, up to 20
ranked findings, sanitized relevant files, and allowlisted next actions.

Build phases: configuration, dependency resolution, compilation, resources, signing, linking, testing, packaging, deployment, or
unknown.

## `audit_localization_keys`

Input:

- `sourceLocale`: required BCP-47 locale string;
- `bundles`: 1–50 unique locale bundles, each with up to 10,000 string entries;
- `referencedKeys`: optional unique list.

`data` contains per-locale audits, findings, totals, and `unusedAnalysis.available`. Supported placeholders are `%@`, `%d`, `%s`,
positional printf placeholders such as `%1$s`, `{name}`, and `{{name}}`.

Raw XML, `.strings`, ARB parsing, duplicate raw-file keys, punctuation quality, and capitalization quality are unsupported in
version 1.

## `validate_release_checklist`

Input:

- `platforms`: unique non-empty array of `android | ios`;
- `releaseType`: `production | hotfix`;
- `version` and `buildNumber`: required bounded strings;
- `policy`: optional immutable policy ID/version selector;
- `checks`: up to 500 unique IDs with `passed | warning | failed | not_run`.

`data` contains the resolved policy, decision `ready | ready_with_warnings | blocked`, passed, warning, failed, missing, unknown
checks, blockers, and recommended actions.

## `triage_mobile_issue`

Input:

- required `title` and `description`;
- non-empty platforms;
- optional reproduction, frequency, affected-user scope, regression, workaround, and environment.

`data` contains problem type, impact, `P0 | P1 | P2 | P3`, reproducibility, platforms, rationale, missing information, and next
actions.

Urgency words do not directly change priority. Security, data loss, generalized critical impact, frequency, and workaround
availability are explicit decision inputs.

## `analyze_crash_log`

Input:

- required `log`;
- platform `auto | android | ios | native`;
- format `auto | android_stacktrace | android_anr | android_tombstone | apple_crash | apple_ips | native_trace`;
- symbolication `auto | symbolicated | partial | unsymbolicated | obfuscated`;
- optional application identifiers and context.

`data` contains crash type, exception, crashed thread, culprit frame, up to 20 relevant frames, up to 10 probable causes, affected
area, and next actions.

Inputs are text or JSON serialized as text. Raw binary reports are unsupported. Unsymbolicated addresses never generate inferred
source symbols.

## `generate_regression_test_plan`

Input:

- change type: bug fix, feature, dependency update, refactor, configuration, or release;
- required description, platforms, and affected areas;
- optional risk signals and known-bug details;
- `maxScenarios`: 1–30, default 20.

`data` contains risk level, coverage areas, assumptions, out-of-scope items, and catalog-backed scenarios. Scenarios include
stable ID, category, priority, risk, platforms, preconditions, steps, expected result, and automation suitability.

Selection is risk-budgeted and never generates the Cartesian product of all platform/device/condition combinations.

## `analyze_app_feedback`

Input:

- 1–500 items;
- each item has required text and optional supplied ID, rating 1–5, source, locale, date, and platform;
- `themeLimit`: 1–9, default 9.

`data` contains multi-label canonical themes, urgent items, unclassified item references, rating availability/summary, and
opportunities.

Canonical themes: crash, performance, authentication, payments, notifications, battery, accessibility, UI/UX, and localization.
Linguistic rules cover English and Portuguese. Unsupported language and ambiguous content lower confidence or remain unclassified.
