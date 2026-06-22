import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

import { describe, expect, it } from "vitest";

const sourceRoot = join(process.cwd(), "src");

function sourceFiles(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);
		return entry.isDirectory() ? sourceFiles(path) : extname(entry.name) === ".ts" ? [path] : [];
	});
}

describe("architecture import boundaries", () => {
	it("confines MCP SDK imports to server adapters", () => {
		const violations = sourceFiles(sourceRoot)
			.filter((file) => readFileSync(file, "utf8").includes("@modelcontextprotocol/sdk"))
			.map((file) => relative(sourceRoot, file).replaceAll("\\", "/"))
			.filter((file) => !file.startsWith("server/"));

		expect(violations).toEqual([]);
	});

	it("keeps contracts, shared code, and analyzers independent of server code", () => {
		const violations = sourceFiles(sourceRoot)
			.filter((file) => /^(contracts|shared|tools)[\\/]/u.test(relative(sourceRoot, file)))
			.filter((file) => /from\s+["'][^"']*server(?:\/|\\)/u.test(readFileSync(file, "utf8")))
			.map((file) => relative(sourceRoot, file).replaceAll("\\", "/"));

		expect(violations).toEqual([]);
	});
});
