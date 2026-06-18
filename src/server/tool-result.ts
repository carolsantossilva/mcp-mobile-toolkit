import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import {
  SCHEMA_VERSION,
  type AnalysisErrorCode,
  type ErrorEnvelope,
} from "../contracts/common.js";
import { canonicalJson, type JsonValue } from "../shared/canonical-json.js";

export type CanonicalJsonSerializer = (value: unknown) => string;

const ERROR_MESSAGES: Readonly<Record<AnalysisErrorCode, string>> = {
  analysis_invalid_arguments: "The request does not satisfy the tool contract.",
  analysis_limit_exceeded: "The request exceeds a documented analysis limit.",
  analysis_unsupported_format: "The supplied artifact format is not supported.",
  analysis_failed: "The analysis could not be completed.",
};

/**
 * An expected tool failure. Messages are intentionally selected from a fixed,
 * public catalog so user input and internal exception details cannot leak.
 */
export class AnalysisToolError extends Error {
  readonly code: AnalysisErrorCode;
  readonly retryable: boolean;

  constructor(code: AnalysisErrorCode, options: { retryable?: boolean } = {}) {
    super(ERROR_MESSAGES[code]);
    this.name = "AnalysisToolError";
    this.code = code;
    this.retryable = options.retryable ?? false;
  }
}

/**
 * Adapts one validated result object to both MCP result representations.
 * The exact same object is reused as structured content and text input.
 */
export function successfulToolResult(
  result: Record<string, unknown>,
  serialize: CanonicalJsonSerializer = serializeCanonicalJson,
): CallToolResult {
  return {
    content: [{ type: "text", text: serialize(result) }],
    structuredContent: result,
  };
}

/**
 * Converts expected and unexpected failures to a bounded, sanitized MCP tool
 * execution error. Unknown failures never expose their message or stack.
 */
export function failedToolResult(error: unknown): CallToolResult {
  const knownError =
    error instanceof AnalysisToolError
      ? error
      : new AnalysisToolError("analysis_failed");

  const payload: ErrorEnvelope = {
    schemaVersion: SCHEMA_VERSION,
    error: {
      code: knownError.code,
      message: ERROR_MESSAGES[knownError.code],
      retryable: knownError.retryable,
    },
  };

  return {
    content: [{ type: "text", text: serializeCanonicalJson(payload) }],
    isError: true,
  };
}

/**
 * Wraps a handler so exceptions consistently become tool execution errors.
 */
export async function adaptToolResult(
  operation: () => Record<string, unknown> | Promise<Record<string, unknown>>,
  serialize: CanonicalJsonSerializer = serializeCanonicalJson,
): Promise<CallToolResult> {
  try {
    return successfulToolResult(await operation(), serialize);
  } catch (error) {
    return failedToolResult(error);
  }
}

function serializeCanonicalJson(value: unknown): string {
  return canonicalJson(value as JsonValue);
}
