import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  ActionSchema,
  AnalysisErrorCodeSchema,
  ErrorEnvelopeSchema,
  EvidenceItemSchema,
  SCHEMA_VERSION,
  SemanticVersionSchema,
  UnavailableSchema,
  WarningSchema,
  createAnalysisResultSchema,
} from "../../src/contracts/common.js";
import {
  DetectablePlatformSchema,
  LocaleSchema,
  MobilePlatformSchema,
  PlatformSchema,
  PrioritySchema,
  ReleaseTypeSchema,
  SeveritySchema,
} from "../../src/contracts/taxonomies.js";

describe("common public contract", () => {
  it("validates a complete successful result envelope", () => {
    const schema = createAnalysisResultSchema(z.object({ findingCount: z.number().int().nonnegative() }).strict());
    const result = schema.parse({
      schemaVersion: SCHEMA_VERSION,
      ruleSetVersion: "1.0.0",
      summary: "One causal finding was identified.",
      confidence: "high",
      data: { findingCount: 1 },
      evidence: [
        {
          id: "build.kotlin.unresolved#001",
          ruleId: "build.kotlin.unresolved",
          source: { type: "text_line_range", startLine: 1, endLine: 1 },
          excerpt: "Unresolved reference",
        },
      ],
      warnings: [],
    });

    expect(result["schemaVersion"]).toBe("1.0");
  });

  it("rejects unknown fields at every public object boundary", () => {
    expect(
      WarningSchema.safeParse({
        code: "build.incomplete",
        message: "Input is incomplete.",
        relatedIds: [],
        unexpected: true,
      }).success,
    ).toBe(false);
    expect(
      EvidenceItemSchema.safeParse({
        id: "build.incomplete#001",
        ruleId: "build.incomplete",
        source: {
          type: "input_field",
          field: "log",
          unexpected: true,
        },
      }).success,
    ).toBe(false);
  });

  it("enforces version, warning, evidence, and unavailable constraints", () => {
    expect(SemanticVersionSchema.safeParse("1.2.3-beta.1+build.7").success).toBe(true);
    expect(SemanticVersionSchema.safeParse("v1.2").success).toBe(false);
    expect(
      UnavailableSchema.parse({
        available: false,
        reason: "build.insufficient_evidence",
      }),
    ).toEqual({
      available: false,
      reason: "build.insufficient_evidence",
    });
    expect(
      WarningSchema.safeParse({
        code: "build.incomplete",
        message: "",
        relatedIds: [],
      }).success,
    ).toBe(false);
  });

  it("defines sanitized stable error envelopes", () => {
    for (const code of AnalysisErrorCodeSchema.options) {
      expect(
        ErrorEnvelopeSchema.parse({
          schemaVersion: "1.0",
          error: {
            code,
            message: "The request could not be analyzed.",
            retryable: false,
          },
        }).error.code,
      ).toBe(code);
    }
    expect(
      ErrorEnvelopeSchema.safeParse({
        schemaVersion: "1.0",
        error: {
          code: "analysis_failed",
          message: "Failure",
          retryable: false,
          stack: "secret stack",
        },
      }).success,
    ).toBe(false);
  });

  it("validates shared actions and taxonomies", () => {
    expect(
      ActionSchema.parse({
        id: "build.rerun_tests",
        description: "Run the checkout unit tests.",
        command: "npm test",
      }).id,
    ).toBe("build.rerun_tests");
    expect(PlatformSchema.options).toEqual(["android", "ios", "cross_platform", "native"]);
    expect(DetectablePlatformSchema.safeParse("auto").success).toBe(true);
    expect(MobilePlatformSchema.safeParse("native").success).toBe(false);
    expect(LocaleSchema.safeParse("pt-BR").success).toBe(true);
    expect(LocaleSchema.safeParse("../pt").success).toBe(false);
    expect(ReleaseTypeSchema.options).toEqual(["production", "hotfix"]);
    expect(SeveritySchema.options).toEqual(["low", "medium", "high", "critical"]);
    expect(PrioritySchema.options).toEqual(["P0", "P1", "P2", "P3"]);
  });
});
