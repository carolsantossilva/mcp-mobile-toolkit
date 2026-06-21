# Quickstart: Mobile Analysis Tools

This quickstart describes the intended developer and client workflow after the
feature is implemented.

## Prerequisites

- Node.js 22 or 24;
- npm;
- an MCP client that can launch a local `stdio` server.

## Install and verify

```powershell
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm pack --dry-run
```

The compiled entry point must not emit diagnostics to `stdout`.

## Run locally

```powershell
node dist/index.js
```

The process waits for MCP messages on standard input. Operational diagnostics,
if any, go to standard error.

## Client configuration

Configure the client to launch:

```json
{
  "mcpServers": {
    "mobile-toolkit": {
      "command": "node",
      "args": ["C:/absolute/path/to/mcp-mobile-toolkit/dist/index.js"]
    }
  }
}
```

## Example call

Tool: `analyze_build_log`

```json
{
  "log": "e: CheckoutViewModel.kt:42: Unresolved reference: getActiveCart\nBUILD FAILED",
  "platform": "android",
  "buildSystem": "gradle"
}
```

Expected result shape:

```json
{
  "schemaVersion": "1.0",
  "ruleSetVersion": "1.0.0",
  "summary": "Kotlin compilation failed because getActiveCart is unresolved.",
  "confidence": "high",
  "data": {
    "failingPhase": "compilation",
    "findings": []
  },
  "evidence": [],
  "warnings": []
}
```

The exact contract is defined in `contracts/`.

## Verification checkpoints

1. `tools/list` includes only tools whose contracts and tests are complete.
2. Every successful `structuredContent` value validates against its output
   schema.
3. The text fallback parses to the same canonical object.
4. Invalid arguments produce a sanitized tool execution error.
5. Incomplete but valid artifacts produce low-confidence success with warnings.
6. Repeated equivalent fixtures produce equivalent canonical output.
7. Redaction tests prove that configured secrets and personal paths do not
   appear in results or errors.
