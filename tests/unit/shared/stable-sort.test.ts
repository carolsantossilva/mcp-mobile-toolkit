import { describe, expect, it } from "vitest";

import {
  chainComparators,
  compareBy,
  compareNumbers,
  compareOptional,
  compareStrings,
  reverseComparator,
  stableSort,
} from "../../../src/shared/stable-sort.js";

describe("stable total ordering", () => {
  it("preserves input order when all explicit keys compare equally", () => {
    const values = [
      { id: "first", score: 1 },
      { id: "second", score: 1 },
      { id: "third", score: 1 },
    ];
    expect(
      stableSort(values, compareBy((value) => value.score, compareNumbers)).map(
        ({ id }) => id,
      ),
    ).toEqual(["first", "second", "third"]);
  });

  it("chains total comparators without locale-sensitive sorting", () => {
    const values = [
      { id: "b", severity: 1, score: 4 },
      { id: "a", severity: 2, score: 1 },
      { id: "c", severity: 2, score: 5 },
    ];
    const comparator = chainComparators(
      compareBy(
        (value) => value.severity,
        reverseComparator(compareNumbers),
      ),
      compareBy((value) => value.score, reverseComparator(compareNumbers)),
      compareBy((value) => value.id, compareStrings),
    );

    expect(stableSort(values, comparator).map(({ id }) => id)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });

  it("places absent optional values deterministically", () => {
    const comparator = compareOptional(compareNumbers);
    expect(comparator(1, undefined)).toBe(-1);
    expect(comparator(null, undefined)).toBe(0);
    expect(compareOptional(compareNumbers, "first")(undefined, 1)).toBe(-1);
  });

  it("orders NaN after finite numbers", () => {
    expect(compareNumbers(Number.NaN, 1)).toBe(1);
    expect(compareNumbers(1, Number.NaN)).toBe(-1);
    expect(compareNumbers(Number.NaN, Number.NaN)).toBe(0);
  });

  it("treats signed zero as equal", () => {
    expect(compareNumbers(-0, 0)).toBe(0);
    expect(compareNumbers(0, -0)).toBe(0);
  });
});
