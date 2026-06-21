import { describe, expect, it } from "vitest";

import { createEvidenceItem, createOccurrenceId, evidenceSource } from "../../../src/shared/evidence.js";

describe("evidence construction", () => {
  it("creates deterministic, zero-padded occurrence IDs", () => {
    expect(createOccurrenceId("build.kotlin.unresolved", 1)).toBe("build.kotlin.unresolved#001");
    expect(createOccurrenceId("build.kotlin.unresolved", 50)).toBe("build.kotlin.unresolved#050");
  });

  it("rejects invalid rule and occurrence IDs", () => {
    expect(() => createOccurrenceId("INVALID", 1)).toThrow();
    expect(() => createOccurrenceId("build.valid", 0)).toThrow(RangeError);
    expect(() => createOccurrenceId("build.valid", 1_000)).toThrow(RangeError);
  });

  it("redacts and bounds excerpts before schema validation", () => {
    const evidence = createEvidenceItem({
      ruleId: "build.kotlin.unresolved",
      occurrence: 1,
      source: evidenceSource.textLineRange(4, 5),
      excerpt: `alice@example.com ${"x".repeat(600)}`,
    });

    expect(evidence.excerpt).not.toContain("alice@example.com");
    expect(evidence.excerpt).toHaveLength(500);
    expect(evidence.source).toEqual({
      type: "text_line_range",
      startLine: 4,
      endLine: 5,
    });
  });

  it("constructs every typed source variant", () => {
    expect(evidenceSource.feedbackItem(0, "ticket-1")).toEqual({
      type: "feedback_item",
      index: 0,
      suppliedId: "ticket-1",
    });
    expect(evidenceSource.localizationEntry("pt-BR", "checkout.title")).toEqual({
      type: "localization_entry",
      locale: "pt-BR",
      key: "checkout.title",
    });
    expect(evidenceSource.releaseCheck("store.metadata")).toEqual({
      type: "release_check",
      checkId: "store.metadata",
    });
    expect(evidenceSource.inputField("description")).toEqual({
      type: "input_field",
      field: "description",
    });
  });
});
