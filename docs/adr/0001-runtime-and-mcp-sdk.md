# ADR 0001: Runtime and MCP SDK Baseline

- **Status**: Accepted
- **Date**: 2026-06-18

## Context

The server needs a supported Node.js baseline, an ESM strategy, and an MCP SDK generation. On the decision date, MCP TypeScript
SDK v2 is pre-alpha while v1.x remains the production recommendation.

## Decision

- Require Node.js 22 or newer.
- Use Node.js 24 as the primary development and CI runtime.
- Test both Node.js 22 and 24.
- Compile strict TypeScript ESM with NodeNext module resolution.
- Use `@modelcontextprotocol/sdk` 1.29.x with an exact lockfile.
- Reassess SDK v2 only after a stable release and a compatibility spike.

## Consequences

- Existing MCP hosts on Node.js 22 remain supported.
- SDK-specific code must be isolated so a future migration does not affect analyzers.
- CI requires a two-version Node.js matrix.
- The package is distributed as compiled ESM rather than runtime TypeScript.

## Alternatives considered

- Node.js 24 minimum: unnecessarily narrows host compatibility.
- CommonJS: weaker alignment with the current SDK and package ecosystem.
- SDK v2 immediately: exposes the project to pre-release contract churn.
- Low-level JSON-RPC implementation: duplicates protocol behavior already provided by the SDK.

## References

- [Official MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Node.js releases](https://nodejs.org/en/about/previous-releases)
