import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const steps = [
  { command: "npm ci", label: "Install dependencies" },
  { command: "npm run verify", label: "Verify" },
];

for (const step of steps) {
  const result = spawnSync(step.command, {
    cwd: repoRoot,
    env: process.env,
    shell: true,
    stdio: "inherit",
  });

  if (result.error !== undefined) {
    console.error(`Failed to run ${step.label.toLowerCase()}:`, result.error.message);
    process.exit(1);
  }

  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}
