import { describe, expect, it } from "vitest";

import {
  matchingLines,
  normalizeForMatching,
  normalizeLineEndings,
} from "../../../src/shared/text.js";

describe("matching text normalization", () => {
  it("normalizes CRLF and CR to LF", () => {
    expect(normalizeLineEndings("a\r\nb\rc\n")).toBe("a\nb\nc\n");
  });

  it("normalizes Unicode to NFC for matching", () => {
    expect(normalizeForMatching("Cafe\u0301")).toBe("Café");
  });

  it("does not mutate the submitted source text", () => {
    const source = "Cafe\u0301\r\nnext";
    normalizeForMatching(source);
    expect(source).toBe("Cafe\u0301\r\nnext");
    expect(matchingLines(source)).toEqual(["Café", "next"]);
  });
});
