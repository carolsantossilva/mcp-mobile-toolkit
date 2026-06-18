export const REDACTION_MARKERS = Object.freeze({
  secret: "[REDACTED_SECRET]",
  email: "[REDACTED_EMAIL]",
  path: "[REDACTED_PATH]",
  identifier: "[REDACTED_IDENTIFIER]",
});

const KEYED_SECRET_PATTERN =
  /\b(api[_-]?key|access[_-]?token|auth[_-]?token|refresh[_-]?token|client[_-]?secret|password|passwd|secret|token)\b(\s*[:=]\s*)(?:"[^"\r\n]{1,2048}"|'[^'\r\n]{1,2048}'|[^\s,;]{1,2048})/giu;
const BEARER_PATTERN = /\bBearer\s+[A-Za-z0-9._~+/-]{8,2048}={0,2}\b/giu;
const JWT_PATTERN =
  /\beyJ[A-Za-z0-9_-]{2,}\.[A-Za-z0-9_-]{2,}\.[A-Za-z0-9_-]{2,}\b/gu;
const KNOWN_TOKEN_PATTERN =
  /\b(?:gh[opusr]_[A-Za-z0-9]{20,255}|github_pat_[A-Za-z0-9_]{20,255}|sk-[A-Za-z0-9_-]{20,255})\b/gu;
const EMAIL_PATTERN =
  /\b[A-Z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+\b/giu;
const WINDOWS_PATH_PATTERN =
  /(?:[A-Za-z]:\\Users\\|\\\\[^\\\s]+\\[^\\\s]+\\Users\\)[^<>:"|?*\s]+/gu;
const POSIX_HOME_PATH_PATTERN =
  /(?:\/Users\/|\/home\/)[^/\s]+(?:\/[^:\s"'<>|]*)*/gu;
const UUID_PATTERN =
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/giu;
const DEVICE_IDENTIFIER_PATTERN =
  /\b(?:[0-9a-f]{40}|[0-9a-f]{64}|[0-9a-f]{16})\b/giu;
const LABELED_IDENTIFIER_PATTERN =
  /\b(device[_ -]?id|android[_ -]?id|identifier|udid|idfv|idfa)(\s*[:=]\s*)[A-Za-z0-9._:-]{6,255}\b/giu;

export function redactSensitiveText(value: string): string {
  return value
    .replace(KEYED_SECRET_PATTERN, (_match, label: string, separator: string) =>
      `${label}${separator}${REDACTION_MARKERS.secret}`,
    )
    .replace(BEARER_PATTERN, `Bearer ${REDACTION_MARKERS.secret}`)
    .replace(JWT_PATTERN, REDACTION_MARKERS.secret)
    .replace(KNOWN_TOKEN_PATTERN, REDACTION_MARKERS.secret)
    .replace(EMAIL_PATTERN, REDACTION_MARKERS.email)
    .replace(WINDOWS_PATH_PATTERN, REDACTION_MARKERS.path)
    .replace(POSIX_HOME_PATH_PATTERN, REDACTION_MARKERS.path)
    .replace(
      LABELED_IDENTIFIER_PATTERN,
      (_match, label: string, separator: string) =>
        `${label}${separator}${REDACTION_MARKERS.identifier}`,
    )
    .replace(UUID_PATTERN, REDACTION_MARKERS.identifier)
    .replace(DEVICE_IDENTIFIER_PATTERN, REDACTION_MARKERS.identifier);
}

export const redact = redactSensitiveText;
