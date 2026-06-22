import { z } from "zod";

export const PlatformSchema = z.enum(["android", "ios", "cross_platform", "native"]);
export type Platform = z.infer<typeof PlatformSchema>;

export const DetectablePlatformSchema = z.enum(["auto", "android", "ios", "cross_platform", "native"]);
export type DetectablePlatform = z.infer<typeof DetectablePlatformSchema>;

export const MobilePlatformSchema = z.enum(["android", "ios"]);
export type MobilePlatform = z.infer<typeof MobilePlatformSchema>;

const BCP_47_PATTERN =
	/^(?=.{2,35}$)(?:(?:[A-Za-z]{2,3}(?:-[A-Za-z]{3}){0,3}|[A-Za-z]{4}|[A-Za-z]{5,8})(?:-[A-Za-z]{4})?(?:-(?:[A-Za-z]{2}|\d{3}))?(?:-(?:[A-Za-z0-9]{5,8}|\d[A-Za-z0-9]{3}))*(?:-[0-9A-WY-Za-wy-z](?:-[A-Za-z0-9]{2,8})+)*(?:-x(?:-[A-Za-z0-9]{1,8})+)?|x(?:-[A-Za-z0-9]{1,8})+)$/;

export const LocaleSchema = z.string().min(2).max(35).regex(BCP_47_PATTERN, "Expected a well-formed BCP-47 locale tag.");
export type Locale = z.infer<typeof LocaleSchema>;

export const ReleaseTypeSchema = z.enum(["production", "hotfix"]);
export type ReleaseType = z.infer<typeof ReleaseTypeSchema>;

export const SeveritySchema = z.enum(["low", "medium", "high", "critical"]);
export type Severity = z.infer<typeof SeveritySchema>;

export const PrioritySchema = z.enum(["P0", "P1", "P2", "P3"]);
export type Priority = z.infer<typeof PrioritySchema>;
