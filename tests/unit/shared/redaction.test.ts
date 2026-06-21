import { describe, expect, it } from "vitest";

import { redactSensitiveText } from "../../../src/shared/redaction.js";

describe("sensitive text redaction", () => {
  it("redacts keyed secrets, bearer tokens, JWTs, and known token prefixes", () => {
    const input = [
      "password=hunter2",
      "Authorization: Bearer abcdefghijklmnop",
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature",
      "ghp_abcdefghijklmnopqrstuvwxyz123456",
    ].join("\n");
    const result = redactSensitiveText(input);

    expect(result).not.toContain("hunter2");
    expect(result).not.toContain("abcdefghijklmnop");
    expect(result).not.toContain("eyJhbGci");
    expect(result).not.toContain("ghp_");
    expect(result.match(/\[REDACTED_SECRET\]/g)?.length).toBe(4);
  });

  it("redacts e-mail addresses and personal home paths", () => {
    const input =
      "alice@example.com C:\\Users\\alice\\repo\\file.kt /home/bob/app/file.swift /Users/carol/project";
    const result = redactSensitiveText(input);

    expect(result).not.toMatch(/alice|bob|carol|example\.com/u);
    expect(result.match(/\[REDACTED_PATH\]/g)?.length).toBe(3);
    expect(result).toContain("[REDACTED_EMAIL]");
  });

  it("redacts UUIDs and labeled device identifiers", () => {
    const input =
      "device_id=ABCDEF0123456789 uuid=550e8400-e29b-41d4-a716-446655440000";
    const result = redactSensitiveText(input);

    expect(result).not.toContain("ABCDEF0123456789");
    expect(result).not.toContain("550e8400");
    expect(result.match(/\[REDACTED_IDENTIFIER\]/g)?.length).toBe(2);
  });

  it("preserves unrelated evidence text", () => {
    expect(redactSensitiveText("Unresolved reference: getActiveCart")).toBe(
      "Unresolved reference: getActiveCart",
    );
  });

  it("preserves unlabeled commit hashes and checksums", () => {
    const input =
      "commit=0123456789abcdef0123456789abcdef01234567 sha256=abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789";

    expect(redactSensitiveText(input)).toBe(input);
  });
});
