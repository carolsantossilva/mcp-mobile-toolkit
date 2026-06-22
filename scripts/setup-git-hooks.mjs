import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

if (process.env.CI === "true") {
  process.exit(0);
}

if (!existsSync(resolve(repoRoot, ".git"))) {
  process.exit(0);
}

const result = spawnSync("git", ["config", "core.hooksPath", ".githooks"], {
  cwd: repoRoot,
  stdio: "ignore",
});

if (result.status !== 0) {
  process.exit(0);
}
