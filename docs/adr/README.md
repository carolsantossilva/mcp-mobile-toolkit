# Architecture Decision Records

Architecture Decision Records capture durable technical decisions that apply across features. Feature-specific research, limits,
taxonomies, and delivery order remain under `specs/<feature>/research.md`.

| ADR                                              | Status   | Decision                                                        |
| ------------------------------------------------ | -------- | --------------------------------------------------------------- |
| [0001](0001-runtime-and-mcp-sdk.md)              | Accepted | Node.js/TypeScript baseline and MCP SDK generation              |
| [0002](0002-stdio-only-transport.md)             | Accepted | Use `stdio` as the only version 1 transport                     |
| [0003](0003-separate-protocol-from-analysis.md)  | Accepted | Isolate MCP adapters from pure analysis modules                 |
| [0004](0004-versioned-structured-contracts.md)   | Accepted | Use strict versioned schemas and structured MCP results         |
| [0005](0005-deterministic-offline-processing.md) | Accepted | Keep processing deterministic, offline, stateless, and redacted |
