import { describe, expect, it } from "vitest";

import { canonicalJson, type JsonValue } from "../../../src/shared/canonical-json.js";

describe("canonical JSON", () => {
  it("sorts object properties recursively by UTF-16 code units", () => {
    expect(
      canonicalJson({
        z: 1,
        a: { beta: true, alpha: false },
        list: [{ y: 2, x: 1 }],
      }),
    ).toBe('{"a":{"alpha":false,"beta":true},"list":[{"x":1,"y":2}],"z":1}');
  });

  it("uses ECMAScript JSON string and number serialization", () => {
    expect(canonicalJson({ negativeZero: -0, quote: '"\n', value: 1e30 })).toBe(
      '{"negativeZero":0,"quote":"\\"\\n","value":1e+30}',
    );
  });

  it("produces identical output for different insertion order", () => {
    expect(canonicalJson({ b: 2, a: 1 })).toBe(canonicalJson({ a: 1, b: 2 }));
  });

  it("rejects non-finite numbers, class instances, and circular values", () => {
    expect(() => canonicalJson(Number.NaN)).toThrow(TypeError);
    expect(() => canonicalJson(Number.POSITIVE_INFINITY)).toThrow(TypeError);
    expect(() => canonicalJson(new Date() as unknown as JsonValue)).toThrow(TypeError);

    const circular: Record<string, JsonValue> = {};
    circular.self = circular;
    expect(() => canonicalJson(circular)).toThrow(TypeError);
  });

  it("rejects sparse arrays", () => {
    const sparse = [1, 2, 3];
    delete sparse[1];

    expect(() => canonicalJson(sparse as unknown as JsonValue)).toThrow(TypeError);
  });

  it("rejects lone Unicode surrogates as required by RFC 8785", () => {
    expect(() => canonicalJson("\ud800")).toThrow(TypeError);
    expect(() => canonicalJson({ "\udc00": "value" })).toThrow(TypeError);
    expect(canonicalJson("😀")).toBe('"😀"');
  });
});
