export const LIMITS = Object.freeze({
  aggregateJsonBytes: 1_048_576,
  logCharacters: 250_000,
  descriptionCharacters: 20_000,
  contextCharacters: 20_000,
  lineCharacters: 20_000,
  feedbackItems: 500,
  feedbackItemCharacters: 10_000,
  localeBundles: 50,
  localeEntries: 10_000,
  totalLocalizationEntries: 100_000,
  localizationKeyCharacters: 512,
  localizationValueCharacters: 20_000,
  releaseChecks: 500,
  regressionScenarios: 30,
  evidenceItems: 50,
  evidenceExcerptCharacters: 500,
  jsonDepth: 20,
} as const);

export type LimitName = keyof typeof LIMITS;

export class LimitExceededError extends Error {
  readonly code = "analysis_limit_exceeded" as const;
  readonly limit: LimitName;
  readonly maximum: number;

  constructor(limit: LimitName, maximum: number) {
    super(`The request exceeds the ${limit} limit.`);
    this.name = "LimitExceededError";
    this.limit = limit;
    this.maximum = maximum;
  }
}

export function utf8ByteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

export function assertMaxUtf8Bytes(
  value: string,
  maximum = LIMITS.aggregateJsonBytes,
  limit: LimitName = "aggregateJsonBytes",
): void {
  if (utf8ByteLength(value) > maximum) {
    throw new LimitExceededError(limit, maximum);
  }
}

export function assertCharacterLimit(
  value: string,
  maximum: number,
  limit: LimitName,
): void {
  if (value.length > maximum) {
    throw new LimitExceededError(limit, maximum);
  }
}

export function assertLineLengthLimit(
  value: string,
  maximum = LIMITS.lineCharacters,
): void {
  for (const line of value.split(/\r\n?|\n/u)) {
    if (line.length > maximum) {
      throw new LimitExceededError("lineCharacters", maximum);
    }
  }
}

export function assertCollectionLimit(
  size: number,
  maximum: number,
  limit: LimitName,
): void {
  if (!Number.isSafeInteger(size) || size < 0 || size > maximum) {
    throw new LimitExceededError(limit, maximum);
  }
}

export function jsonDepth(value: unknown): number {
  const ancestors = new Set<object>();

  const visit = (current: unknown, depth: number): number => {
    if (current === null || typeof current !== "object") {
      return depth;
    }
    if (ancestors.has(current)) {
      throw new TypeError("Circular JSON values are not supported.");
    }

    ancestors.add(current);
    let maximum = depth;
    const values = Array.isArray(current)
      ? current
      : Object.values(current as Record<string, unknown>);
    for (const child of values) {
      maximum = Math.max(maximum, visit(child, depth + 1));
    }
    ancestors.delete(current);
    return maximum;
  };

  return visit(value, 0);
}

export function assertJsonDepthLimit(
  value: unknown,
  maximum = LIMITS.jsonDepth,
): void {
  if (jsonDepth(value) > maximum) {
    throw new LimitExceededError("jsonDepth", maximum);
  }
}

export function assertAggregateJsonLimit(
  value: unknown,
  maximum = LIMITS.aggregateJsonBytes,
): void {
  const serialized = JSON.stringify(value);
  if (serialized === undefined) {
    throw new TypeError("The value is not JSON serializable.");
  }
  assertMaxUtf8Bytes(serialized, maximum, "aggregateJsonBytes");
}
