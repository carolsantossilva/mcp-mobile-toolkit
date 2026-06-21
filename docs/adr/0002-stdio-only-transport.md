# ADR 0002: Use stdio as the Version 1 Transport

- **Status**: Accepted
- **Date**: 2026-06-18

## Context

The initial users run the toolkit as a local process launched by an MCP client.
Remote hosting, authentication, and long-running services are not required.

## Decision

- Support only MCP over `stdio` in version 1.
- Reserve `stdout` exclusively for MCP protocol framing.
- Send bounded, sanitized operational diagnostics to `stderr`.
- Add compiled-process integration tests that detect non-protocol output.

## Consequences

- Version 1 needs no HTTP server, port configuration, authentication layer, or
  persistent process.
- Any accidental logging to `stdout` is a protocol defect.
- Remote access requires a future decision and separate security model.

## Alternatives considered

- Streamable HTTP: defer until a concrete remote-hosting requirement exists.
- HTTP+SSE: adds a legacy surface without current value.
- Custom transport: unnecessary protocol and maintenance risk.
