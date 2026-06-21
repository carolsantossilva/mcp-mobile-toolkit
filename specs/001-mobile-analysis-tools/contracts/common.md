# Common MCP Contract

## Discovery

The server advertises the MCP `tools` capability. Each tool definition includes
a unique name, description, strict input schema, and strict output schema.

## Successful result

```json
{
  "schemaVersion": "1.0",
  "ruleSetVersion": "1.0.0",
  "summary": "Bounded human-readable summary",
  "confidence": "high",
  "data": {},
  "evidence": [],
  "warnings": []
}
```

The object is returned as validated `structuredContent` and as one text content
item containing its canonical JSON representation.

## Tool execution error

Schema, limit, precondition, unsupported-format, and internal failures return
`isError: true` with sanitized text representing:

```json
{
  "schemaVersion": "1.0",
  "error": {
    "code": "analysis_invalid_arguments",
    "message": "The request does not satisfy the tool contract.",
    "retryable": false
  }
}
```

Allowed base codes:

- `analysis_invalid_arguments`;
- `analysis_limit_exceeded`;
- `analysis_unsupported_format`;
- `analysis_failed`.

Errors never include raw input, excerpts, stack traces, environment values, or
filesystem paths.

## Insufficient evidence

Valid but incomplete input returns a successful result with:

- `confidence: "low"`;
- a stable warning code;
- explicit unavailable fields;
- no unsupported definitive conclusion.

## Determinism

- LF and NFC are used for matching only.
- Returned excerpts preserve submitted text after redaction.
- Arrays use explicit total comparators.
- Canonical JSON property ordering is stable.
- Results contain no timestamps, random IDs, host data, locale-dependent sort,
  or discovery-order dependencies.

## Security

- Analyzers perform no network, device, filesystem, persistent-storage, or
  environment-variable access.
- Excerpts are produced only after redaction.
- Suggested commands come from an allowlisted catalog and never interpolate
  untrusted log text.
- `stdout` is exclusively MCP protocol output.
