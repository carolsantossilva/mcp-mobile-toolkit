import type {
  EvidenceItem,
  EvidenceSource,
  RuleId,
} from "../contracts/common.js";
import { EvidenceItemSchema, RuleIdSchema } from "../contracts/common.js";
import { LIMITS } from "./limits.js";
import { redactSensitiveText } from "./redaction.js";

export function createOccurrenceId(
  ruleId: RuleId | string,
  occurrence: number,
): string {
  RuleIdSchema.parse(ruleId);
  if (!Number.isSafeInteger(occurrence) || occurrence < 1 || occurrence > 999) {
    throw new RangeError("Evidence occurrence must be an integer from 1 to 999.");
  }
  return `${ruleId}#${occurrence.toString().padStart(3, "0")}`;
}

export function createEvidenceItem(input: {
  ruleId: RuleId | string;
  occurrence: number;
  source: EvidenceSource;
  excerpt?: string;
}): EvidenceItem {
  const excerpt =
    input.excerpt === undefined
      ? undefined
      : redactSensitiveText(input.excerpt).slice(
          0,
          LIMITS.evidenceExcerptCharacters,
        );

  return EvidenceItemSchema.parse({
    id: createOccurrenceId(input.ruleId, input.occurrence),
    ruleId: input.ruleId,
    source: input.source,
    ...(excerpt === undefined ? {} : { excerpt }),
  });
}

export const evidenceSource = Object.freeze({
  textLineRange(startLine: number, endLine = startLine): EvidenceSource {
    return { type: "text_line_range", startLine, endLine };
  },
  feedbackItem(index: number, suppliedId?: string): EvidenceSource {
    return {
      type: "feedback_item",
      index,
      ...(suppliedId === undefined ? {} : { suppliedId }),
    };
  },
  localizationEntry(locale: string, key: string): EvidenceSource {
    return { type: "localization_entry", locale, key };
  },
  releaseCheck(checkId: string): EvidenceSource {
    return { type: "release_check", checkId };
  },
  inputField(field: string): EvidenceSource {
    return { type: "input_field", field };
  },
});
