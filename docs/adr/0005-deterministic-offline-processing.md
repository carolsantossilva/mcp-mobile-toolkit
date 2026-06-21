# ADR 0005: Deterministic Offline and Stateless Processing

- **Status**: Accepted
- **Date**: 2026-06-18

## Context

Mobile engineering artifacts can contain sensitive identifiers and pathological
input. The toolkit must produce reproducible results without external services
or hidden state.

## Decision

- Analyzers perform no network, device, filesystem, persistent-storage, or
  environment-variable access.
- Runtime retention is zero.
- Enforce byte, character, collection, line-length, and nesting limits.
- Redact sensitive content before constructing evidence, diagnostics, or errors.
- Normalize LF and Unicode NFC for matching only; preserve returned source text
  after redaction.
- Use explicit total comparators and no locale-sensitive ordering.
- Produce a canonical JSON text fallback aligned with RFC 8785 ordering
  behavior.
- Do not include timestamps, random IDs, host data, timezone, or discovery
  order in analysis results.
- Use bounded patterns and adversarial tests to reduce regular-expression denial
  of service risk.

## Consequences

- Equivalent normalized inputs produce semantically equivalent and canonically
  ordered results.
- Features requiring remote services, file reads, devices, or persistence need
  a new architectural decision.
- Evidence offsets refer to normalized analysis input while excerpts are
  redacted.
- Limits and redaction behavior are public contract concerns and require
  boundary tests.

## Alternatives considered

- LLM-backed or remote analysis: introduces nondeterminism, privacy, cost, and
  availability concerns.
- Logging sanitized payloads: still creates retention risk.
- Plain `JSON.stringify`: does not define a durable canonicalization contract.
- Normalize returned user text: alters source evidence.

## References

- [RFC 8785: JSON Canonicalization Scheme](https://www.rfc-editor.org/rfc/rfc8785)
