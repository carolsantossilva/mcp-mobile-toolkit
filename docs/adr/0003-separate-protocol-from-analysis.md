# ADR 0003: Separate MCP Adapters from Analysis Logic

- **Status**: Accepted
- **Date**: 2026-06-18

## Context

The seven tools contain domain rules that should be testable without an MCP transport and should survive future SDK changes.

## Decision

- Confine MCP SDK imports to `src/server/` and thin tool registration adapters.
- Implement analysis as pure modules under `src/tools/<tool-name>/`.
- Keep public wire schemas under `src/contracts/`.
- Keep normalized internal representations separate from public schemas.
- Allow shared modules only for proven cross-tool concerns such as redaction, limits, evidence, stable ordering, and canonical
  serialization.

## Consequences

- Unit tests can exercise analyzers without starting a server.
- SDK upgrades are localized to the protocol boundary.
- Tool-specific taxonomies and rules remain independently maintainable.
- Shared abstractions must be extracted from demonstrated reuse rather than anticipated reuse.

## Alternatives considered

- Put business rules in MCP handlers: tightly couples tests and domain logic to the SDK.
- Build a large SDK-neutral protocol framework: premature abstraction.
- One shared rules engine for every tool: hides meaningful domain differences.
