import { z } from "zod";

import { LocaleSchema } from "./taxonomies.js";

export const SCHEMA_VERSION = "1.0" as const;

export const SchemaVersionSchema = z.literal(SCHEMA_VERSION);
export type SchemaVersion = z.infer<typeof SchemaVersionSchema>;

const SEMANTIC_VERSION_PATTERN =
	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

export const SemanticVersionSchema = z.string().max(100).regex(SEMANTIC_VERSION_PATTERN, "Expected a semantic version.");
export type SemanticVersion = z.infer<typeof SemanticVersionSchema>;

export const ConfidenceSchema = z.enum(["low", "medium", "high"]);
export type Confidence = z.infer<typeof ConfidenceSchema>;

export const StableCodeSchema = z
	.string()
	.min(3)
	.max(120)
	.regex(/^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)+$/, "Expected a stable lowercase namespaced code.");

export const RuleIdSchema = StableCodeSchema;
export type RuleId = z.infer<typeof RuleIdSchema>;

export const RuleSetVersionSchema = SemanticVersionSchema;
export type RuleSetVersion = SemanticVersion;

export const EvidenceIdSchema = z
	.string()
	.max(124)
	.regex(/^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)+#\d{3}$/, "Expected an evidence occurrence ID ending in #NNN.");
export type EvidenceId = z.infer<typeof EvidenceIdSchema>;

export const TextLineEvidenceSourceSchema = z
	.object({
		type: z.literal("text_line_range"),
		startLine: z.number().int().positive(),
		endLine: z.number().int().positive(),
	})
	.strict();

export const FeedbackEvidenceSourceSchema = z
	.object({
		type: z.literal("feedback_item"),
		index: z.number().int().nonnegative(),
		suppliedId: z.string().min(1).max(200).optional(),
	})
	.strict();

export const LocalizationEvidenceSourceSchema = z
	.object({
		type: z.literal("localization_entry"),
		locale: LocaleSchema,
		key: z.string().min(1).max(512),
	})
	.strict();

export const ReleaseCheckEvidenceSourceSchema = z
	.object({
		type: z.literal("release_check"),
		checkId: z.string().min(1).max(200),
	})
	.strict();

export const InputFieldEvidenceSourceSchema = z
	.object({
		type: z.literal("input_field"),
		field: z.string().min(1).max(200),
	})
	.strict();

export const EvidenceSourceSchema = z
	.discriminatedUnion("type", [
		TextLineEvidenceSourceSchema,
		FeedbackEvidenceSourceSchema,
		LocalizationEvidenceSourceSchema,
		ReleaseCheckEvidenceSourceSchema,
		InputFieldEvidenceSourceSchema,
	])
	.superRefine((source, context) => {
		if (source.type === "text_line_range" && source.endLine < source.startLine) {
			context.addIssue({
				code: "custom",
				message: "endLine must be greater than or equal to startLine.",
				path: ["endLine"],
			});
		}
	});
export type EvidenceSource = z.infer<typeof EvidenceSourceSchema>;

export const EvidenceItemSchema = z
	.object({
		id: EvidenceIdSchema,
		ruleId: RuleIdSchema,
		source: EvidenceSourceSchema,
		excerpt: z.string().max(500).optional(),
	})
	.strict();
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;

export const WarningSchema = z
	.object({
		code: StableCodeSchema,
		message: z.string().min(1).max(500),
		relatedIds: z.array(z.string().min(1).max(200)).max(50),
	})
	.strict();
export type Warning = z.infer<typeof WarningSchema>;

export const UnavailableSchema = z
	.object({
		available: z.literal(false),
		reason: StableCodeSchema,
	})
	.strict();
export type Unavailable = z.infer<typeof UnavailableSchema>;

export const ActionSchema = z
	.object({
		id: StableCodeSchema,
		description: z.string().min(1).max(500),
		command: z.string().min(1).max(500).optional(),
	})
	.strict();
export type Action = z.infer<typeof ActionSchema>;
export const SuggestedActionSchema = ActionSchema;
export type SuggestedAction = Action;

export const AnalysisErrorCodeSchema = z.enum([
	"analysis_invalid_arguments",
	"analysis_limit_exceeded",
	"analysis_unsupported_format",
	"analysis_failed",
]);
export type AnalysisErrorCode = z.infer<typeof AnalysisErrorCodeSchema>;

export const AnalysisErrorSchema = z
	.object({
		code: AnalysisErrorCodeSchema,
		message: z.string().min(1).max(500),
		retryable: z.boolean(),
	})
	.strict();
export type AnalysisError = z.infer<typeof AnalysisErrorSchema>;
export const ToolErrorSchema = AnalysisErrorSchema;
export type ToolError = AnalysisError;

export const ErrorEnvelopeSchema = z
	.object({
		schemaVersion: SchemaVersionSchema,
		error: AnalysisErrorSchema,
	})
	.strict();
export type ErrorEnvelope = z.infer<typeof ErrorEnvelopeSchema>;
export const ToolErrorEnvelopeSchema = ErrorEnvelopeSchema;
export type ToolErrorEnvelope = ErrorEnvelope;

export function createAnalysisResultSchema(dataSchema: z.ZodType): z.ZodType {
	return z
		.object({
			schemaVersion: SchemaVersionSchema,
			ruleSetVersion: SemanticVersionSchema,
			summary: z.string().min(1).max(500),
			confidence: ConfidenceSchema,
			data: dataSchema,
			evidence: z.array(EvidenceItemSchema).max(50),
			warnings: z.array(WarningSchema).max(50),
		})
		.strict();
}

export const analysisResultSchema = createAnalysisResultSchema;

export interface AnalysisResult<T> {
	schemaVersion: SchemaVersion;
	ruleSetVersion: SemanticVersion;
	summary: string;
	confidence: Confidence;
	data: T;
	evidence: EvidenceItem[];
	warnings: Warning[];
}
