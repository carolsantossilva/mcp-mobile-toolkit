export type Comparator<T> = (left: T, right: T) => number;

export function compareNumbers(left: number, right: number): number {
  if (Number.isNaN(left) && Number.isNaN(right)) return 0;
  if (Number.isNaN(left)) return 1;
  if (Number.isNaN(right)) return -1;
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

export function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function compareBooleans(left: boolean, right: boolean): number {
  return left === right ? 0 : left ? 1 : -1;
}

export function compareOptional<T>(
  comparator: Comparator<T>,
  absent: "first" | "last" = "last",
): Comparator<T | null | undefined> {
  return (left, right) => {
    const leftAbsent = left === null || left === undefined;
    const rightAbsent = right === null || right === undefined;
    if (leftAbsent && rightAbsent) return 0;
    if (leftAbsent) return absent === "first" ? -1 : 1;
    if (rightAbsent) return absent === "first" ? 1 : -1;
    return comparator(left, right);
  };
}

export function reverseComparator<T>(
  comparator: Comparator<T>,
): Comparator<T> {
  return (left, right) => comparator(right, left);
}

export function chainComparators<T>(
  ...comparators: readonly Comparator<T>[]
): Comparator<T> {
  return (left, right) => {
    for (const comparator of comparators) {
      const result = comparator(left, right);
      if (result !== 0) return result < 0 ? -1 : 1;
    }
    return 0;
  };
}

export function compareBy<T, K>(
  selector: (value: T) => K,
  comparator: Comparator<K>,
): Comparator<T> {
  return (left, right) => comparator(selector(left), selector(right));
}

export function stableSort<T>(
  values: readonly T[],
  comparator: Comparator<T>,
): T[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort(
      (left, right) =>
        comparator(left.value, right.value) ||
        compareNumbers(left.index, right.index),
    )
    .map(({ value }) => value);
}
