# Data Model: Mobile Analysis Tools

## Shared entities

### AnalysisResult

Envelope for every successful tool call.

| Field | Type | Rules |
|---|---|---|
| `schemaVersion` | literal `"1.0"` | Changes only for incompatible public contract revisions |
| `ruleSetVersion` | semantic version string | Identifies classification/rule behavior |
| `summary` | string | 1–500 characters; no raw secrets |
| `confidence` | `low \| medium \| high` | Evidence quality, not severity |
| `data` | tool-specific object | Must validate against the tool output schema |
| `evidence` | `EvidenceItem[]` | Always present; maximum 50 |
| `warnings` | `Warning[]` | Always present; maximum 50 |

### EvidenceItem

| Field | Type | Rules |
|---|---|---|
| `id` | string | Deterministic occurrence ID, `<ruleId>#NNN` |
| `ruleId` | string | Stable namespaced rule ID |
| `source` | `EvidenceSource` | Typed source location |
| `excerpt` | string, optional | Maximum 500 characters after redaction |

`EvidenceSource` variants:

- text line range;
- feedback item index and optional supplied ID;
- localization locale and key;
- release check ID;
- input field name.

### Warning

| Field | Type | Rules |
|---|---|---|
| `code` | string | Stable namespaced warning code |
| `message` | string | Human-readable and sanitized |
| `relatedIds` | string[] | Deterministically ordered references |

### Unavailable

Represents a meaningful absence without `null` or omitted interpretation.

```text
available: false
reason: stable reason code
```

### Rule

| Field | Type | Rules |
|---|---|---|
| `id` | string | Lowercase ASCII namespace, never reused |
| `version` | integer | Increment for incompatible semantic change |
| `scope` | platforms/formats/languages | Explicit applicability |
| `precedence` | integer | Deterministic comparison input |
| `match` | pure predicate/extractor | Bounded and side-effect free |
| `effect` | finding/classification template | No user-derived executable command |

Rule ID namespaces: `build.*`, `crash.*`, `issue.*`, `l10n.*`, `release.*`,
`regression.*`, and `feedback.*`.

## Tool-specific entities

### BuildFinding

Category, build phase, severity, message, optional sanitized file/line/column,
score, and supporting evidence IDs. Findings sort by severity, score,
precedence, source location, then ID.

### CrashFrame and RankedCause

`CrashFrame` records module, symbol, optional file/line, framework/application
classification, and evidence. `RankedCause` records a bounded explanation,
confidence, score, and evidence. Unsymbolicated addresses never produce inferred
source files or methods.

### IssueTriage

Problem type, impact, priority, reproducibility, affected platforms, rationale,
missing information, and next actions. Priority is derived from impact,
affected-user scope, frequency, workaround, and explicit security/data-loss
conditions.

State derivation:

```text
input facts
  -> normalized facts
  -> impact and reproducibility
  -> priority decision matrix
  -> rationale and missing information
```

### LocalizationFinding

Locale, key, finding type, source/target placeholder sets, optional source and
target values after redaction, and evidence. Finding types include missing,
extra, unused, empty, placeholder count/type/position mismatch, whitespace, and
line-break mismatch.

### ReleasePolicyProfile

Immutable policy ID and semantic version, platform scope, release type,
required checks, blocking checks, and warning checks.

Initial profiles:

- `release.ios.production@1.0.0`;
- `release.android.production@1.0.0`;
- `release.cross-platform.production@1.0.0`;
- `release.mobile.hotfix@1.0.0`.

### RegressionScenario

Stable catalog ID, category, priority, risk, platforms, preconditions, steps,
expected result, and automation suitability. Scenario IDs come from the catalog,
not input text. Selection stops at the configured budget.

### FeedbackTheme

Canonical theme, matching item references, count, severity, sentiment,
opportunity, and evidence. Classification is multi-label, so theme counts may
exceed input item count. Unclassified items remain explicit.

## Validation limits

| Area | Limit |
|---|---:|
| Aggregate JSON payload | 1 MiB UTF-8 |
| Log | 250,000 JavaScript characters |
| Description/context | 20,000 characters |
| Individual analyzed line | 20,000 characters |
| Feedback items | 500 |
| Text per feedback item | 10,000 characters |
| Locale bundles | 50 |
| Entries per locale | 10,000 |
| Total localization entries | 100,000 |
| Localization key | 512 characters |
| Localization value | 20,000 characters |
| Release checks | 500 |
| Regression scenarios | 30 |
| Evidence items | 50 |
| Evidence excerpt | 500 characters |
| JSON depth | 20 |

The tightest applicable limit wins. Duplicate release check IDs and duplicate
locale IDs are invalid arguments. NFC-equivalent localization-key collisions
are reported and never merged silently.

## Version transitions

- `schemaVersion` changes only for incompatible envelope or tool-contract
  changes.
- `ruleSetVersion` changes when rules, precedence, or classification semantics
  change.
- Release policy versions are immutable.
- Rule IDs are never reused for a different meaning.
- Patch releases fix unintended behavior without intended taxonomy changes;
  minor releases may add documented rules, policies, or formats; major releases
  may change fields, enums, or meanings.
