import { describe, expect, it } from "vitest";

import {
  LIMITS,
  LimitExceededError,
  assertAggregateJsonLimit,
  assertCharacterLimit,
  assertCollectionLimit,
  assertJsonDepthLimit,
  assertLineLengthLimit,
  assertMaxUtf8Bytes,
  jsonDepth,
  utf8ByteLength,
} from "../../../src/shared/limits.js";

describe("shared limits", () => {
  it("counts UTF-8 bytes separately from JavaScript characters", () => {
    expect("😀".length).toBe(2);
    expect(utf8ByteLength("😀")).toBe(4);
    expect(() => assertMaxUtf8Bytes("😀", 3)).toThrow(LimitExceededError);
    expect(() => assertMaxUtf8Bytes("😀", 4)).not.toThrow();
  });

  it("enforces character, line, and collection boundaries inclusively", () => {
    expect(() => assertCharacterLimit("123", 3, "descriptionCharacters")).not.toThrow();
    expect(() => assertCharacterLimit("1234", 3, "descriptionCharacters")).toThrow(LimitExceededError);
    expect(() => assertLineLengthLimit("123\r\n456", 3)).not.toThrow();
    expect(() => assertLineLengthLimit("1234\n5", 3)).toThrow(LimitExceededError);
    expect(() => assertCollectionLimit(500, 500, "feedbackItems")).not.toThrow();
    expect(() => assertCollectionLimit(501, 500, "feedbackItems")).toThrow(LimitExceededError);
  });

  it("measures and enforces JSON depth", () => {
    expect(jsonDepth({ a: [{ b: true }] })).toBe(3);
    expect(() => assertJsonDepthLimit({ a: { b: true } }, 2)).not.toThrow();
    expect(() => assertJsonDepthLimit({ a: { b: true } }, 1)).toThrow(LimitExceededError);
  });

  it("rejects circular depth traversal and oversized aggregate JSON", () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;
    expect(() => jsonDepth(circular)).toThrow(TypeError);
    expect(() => assertAggregateJsonLimit({ value: "é" }, 5)).toThrow(LimitExceededError);
  });

  it("publishes the documented shared maxima", () => {
    expect(LIMITS.aggregateJsonBytes).toBe(1_048_576);
    expect(LIMITS.lineCharacters).toBe(20_000);
    expect(LIMITS.evidenceItems).toBe(50);
    expect(LIMITS.jsonDepth).toBe(20);
  });
});
