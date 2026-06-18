# Research: Mobile Analysis Tools

Durable architecture decisions were extracted to
[`docs/adr/`](../../docs/adr/README.md). This file retains feature-specific
research and records how those decisions apply to this feature.

## Node.js and TypeScript baseline

**Decision**: Apply
[ADR 0001](../../docs/adr/0001-runtime-and-mcp-sdk.md): support Node.js 22 and
24, compile strict TypeScript ESM, and use MCP SDK v1.29.x.

**Rationale**: Node 24 is the current LTS reference on 2026-06-18 while Node 22
remains supported. A Node 22 minimum keeps compatibility with existing MCP
hosts. NodeNext matches Node ESM semantics without a bundler.

**Alternatives considered**:

- Node 24 minimum: simpler support matrix but unnecessarily excludes Node 22.
- CommonJS: weaker alignment with the SDK and current package ecosystem.
- Bundled executable: additional build complexity without a demonstrated need.

Source: [Node.js releases](https://nodejs.org/en/about/previous-releases)

## Transport

**Decision**: Apply
[ADR 0002](../../docs/adr/0002-stdio-only-transport.md): expose this feature
only through local MCP `stdio`.

**Rationale**: The target use is a local client-managed process. `stdio` avoids
ports, authentication, remote exposure, and persistent services. `stdout` is
reserved exclusively for MCP framing; sanitized diagnostics use `stderr`.

**Alternatives considered**:

- Streamable HTTP: defer until a real remote-hosting requirement exists.
- HTTP+SSE: legacy surface with no current need.

## Validation and schemas

**Decision**: Apply
[ADR 0004](../../docs/adr/0004-versioned-structured-contracts.md): use strict
Zod 4 public schemas and keep normalized internal representations separate.

**Rationale**: Zod 4 supports JSON Schema conversion and is compatible with the
SDK. Strict objects prevent silently ignored fields. Separating normalized
values prevents LF/NFC matching rules from unexpectedly changing returned
source text.

**Alternatives considered**:

- Handwritten JSON Schema: duplicates contract definitions.
- Permissive schemas: make typos and contract drift difficult to detect.
- Zod transforms on public values: obscure the difference between submitted and
  analyzed content.

Source: [Zod JSON Schema](https://zod.dev/json-schema)

## Structured results

**Decision**: Apply
[ADR 0004](../../docs/adr/0004-versioned-structured-contracts.md): every
successful tool returns validated structured content and the equivalent
canonical JSON text fallback.

**Rationale**: MCP supports structured output and recommends a text fallback
for clients that do not consume structured content. Creating the object once
prevents divergence.

**Alternatives considered**:

- Text only: not suitable for reliable chaining or automation.
- Structured content only: reduces compatibility with existing clients.
- Separate human summary object: introduces another representation to keep in
  sync.

Source: [MCP tools specification](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)

## Error model

**Decision**:

- malformed protocol messages and unknown methods remain SDK-level protocol
  errors;
- schema, limit, and tool precondition failures return sanitized tool execution
  errors with `isError: true`;
- valid but insufficient evidence returns success with low confidence and
  structured warnings;
- unexpected failures return a stable generic error code without input or stack
  data.

**Rationale**: Clients can distinguish protocol failure, invalid invocation,
partial analysis, and internal failure without parsing free-form text.

**Alternatives considered**:

- Force every invalid argument into JSON-RPC `-32602`: conflicts with the
  high-level SDK tool path and adds low-level handling.
- Return every condition as success: hides internal defects and unsupported
  formats.

## Determinism

**Decision**: Apply
[ADR 0005](../../docs/adr/0005-deterministic-offline-processing.md), including
separate semantic and textual determinism.

**Rationale**: JavaScript insertion order is not a sufficient public
canonicalization contract. Locale-sensitive comparison, timestamps, random
values, and discovery order would make fixtures unstable.

**Alternatives considered**:

- Plain `JSON.stringify`: stable in common cases but not an explicit canonical
  contract.
- Normalize returned values: would alter user-provided artifacts.
- Add a canonical-JSON dependency: unnecessary for the small supported JSON
  value set.

Source: [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785)

## Security and limits

**Decision**: Apply
[ADR 0005](../../docs/adr/0005-deterministic-offline-processing.md). For this
feature, use the concrete limits documented in `data-model.md`.

**Rationale**: Artifacts commonly contain tokens, e-mail addresses, local paths,
device identifiers, and very long lines. Limiting only aggregate request size
does not prevent pathological collections or regular-expression input.

**Alternatives considered**:

- Log sanitized payloads: still creates retention and disclosure risk.
- Redact only final responses: intermediate evidence and exceptions may leak.
- One global payload cap: insufficient for pathological nested fields.

## Testing

**Decision**: Use Vitest 4 for unit, contract, and adversarial fixture tests,
plus compiled-process integration over `stdio`. Run CI on Node 22 and 24.

**Rationale**: Unit tests prove rules and precedence; contract tests prove
schemas and MCP discovery; real-process tests prove packaging and `stdout`
discipline. Snapshots are supplementary, not substitutes for explicit rule and
decision assertions.

**Alternatives considered**:

- Transport mocks only: cannot catch packaging or protocol-output leakage.
- Snapshot-only suites: weak failure diagnostics and rule traceability.

## Packaging

**Decision**: Publish a compiled ESM CLI with a `bin` entry, Node 22 engine
constraint, versioned lockfile, `prepack` build, `npm pack --dry-run`, and a
tarball installation smoke test. Do not expose a public library API in v1.

**Rationale**: MCP clients need an executable command. Compiled JavaScript is
more predictable than requiring `tsx` at runtime. A tarball smoke test catches
missing files and shebang/package metadata errors.

**Alternatives considered**:

- Execute TypeScript directly: appropriate only for development.
- Publish source, tests, and fixtures: larger and unnecessary runtime package.
- Add a bundler: no current requirement.

Source: [npm package.json documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)

## Tool delivery order

**Decision**: Deliver build analysis first, then localization and release
validation, then issue triage and crash analysis, followed by regression
planning and feedback analysis.

**Rationale**: The first tool proves the README demonstration. The next two are
deterministic and stabilize shared contracts before the more uncertain
classifiers.

**Alternatives considered**:

- Implement all tools concurrently: expands contract and fixture risk.
- Implement crash analysis second: delays simpler validation of shared
  contracts and policies.
