<!-- SPECKIT START -->

For feature-specific technology, structure, and implementation context, read `specs/001-mobile-analysis-tools/plan.md`.

<!-- SPECKIT END -->

# Project guidance

- This repository is planned as a TypeScript MCP server. Keep transport code separate from deterministic analysis logic as
  implementation is added.
- Use strict Zod schemas for every public tool input and output.
- Keep the v1 tools offline: no network, device, filesystem, LLM, or persistent storage access unless a later specification
  explicitly adds it.
- Never write diagnostics to `stdout` when using MCP over stdio. Use `stderr`.
- Redact secrets, personal paths, e-mail addresses, and identifiers before returning evidence extracted from user-provided
  artifacts.
- Add contract tests for MCP-visible changes and unit tests for every analysis rule. Use Vitest and TypeScript test files.
- Preserve stable ordering and deterministic output for equivalent inputs.
- Read `specs/001-mobile-analysis-tools/plan.md` before implementing this feature.
