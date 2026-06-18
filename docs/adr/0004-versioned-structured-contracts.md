# ADR 0004: Versioned Structured Tool Contracts

- **Status**: Accepted
- **Date**: 2026-06-18

## Context

MCP clients need results that can be rendered, validated, and chained without
parsing prose. Contracts must also distinguish invalid invocation, insufficient
evidence, and internal failure.

## Decision

- Define strict Zod 4 schemas for every public input and successful output.
- Reject unknown public fields.
- Declare an MCP `outputSchema` for every tool.
- Return successful results as validated `structuredContent`.
- Return one text content item containing the canonical JSON representation of
  the same successful object.
- Include `schemaVersion` and `ruleSetVersion` in successful results.
- Represent valid but insufficient evidence as low-confidence success with
  structured warnings.
- Return schema, limit, precondition, unsupported-format, and internal failures
  as sanitized tool execution errors with stable codes.

## Consequences

- Clients can validate and automate against stable data structures.
- Schema, rule-set, and release-policy versions can evolve independently.
- Additive public changes still require compatibility review because schemas
  are strict.
- The result object must be created once and reused for structured and text
  representations.

## Alternatives considered

- Text-only results: unsuitable for reliable automation.
- Structured content without text fallback: reduces client compatibility.
- Permissive objects: silently accept typos and contract drift.
- Handwritten JSON Schema plus separate TypeScript types: duplicates the source
  of truth.

## References

- [MCP tools specification](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [Zod JSON Schema](https://zod.dev/json-schema)
