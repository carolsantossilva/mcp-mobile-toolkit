export function normalizeLineEndings(value: string): string {
	return value.replace(/\r\n?/gu, "\n");
}

export function normalizeForMatching(value: string): string {
	return normalizeLineEndings(value).normalize("NFC");
}

export function matchingLines(value: string): readonly string[] {
	return normalizeForMatching(value).split("\n");
}
