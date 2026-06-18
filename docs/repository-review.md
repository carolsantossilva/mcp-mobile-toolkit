# Repository Review

## Executive summary

The repository currently contains a product definition and a GitHub Spec Kit
scaffold, but no TypeScript MCP implementation yet.

- Before this review, `LICENSE` was the only tracked project file.
- The reviewed documentation, ignore rules, and minimal Spec Kit setup are now
  tracked in separate commits.
- There is no `package.json`, source code, test suite, example data, or CI.
- The Spec Kit scaffold contains roughly 300 KB across more than 60 files.
- Most of that volume is generated workflow, integration, extension, and agent
  material. It is not product code and normally does not require manual review.

The project intention is coherent. The main issue is that the repository mixes
three different concerns without documenting their status:

1. product documentation;
2. project-specific engineering governance;
3. generated Spec Kit runtime and integration files.

## Recommended repository policy

Decision: use Spec Kit as the official planning process and version its core
Codex/PowerShell installation so a clone can reproduce the workflow. Keep its
footprint explicit and conservative:

- version project-specific specifications, plans, tasks, and constitution;
- version the minimum installed integration files required to reproduce the
  workflow;
- ignore runtime state and downloaded caches;
- avoid automatic Git mutations from hooks;
- do not manually maintain generated skills, manifests, or scripts unless an
  upgrade or integration issue requires it;
- customize the project-facing templates for TypeScript, MCP, Zod, and Vitest.

Version `.agents/skills/`, `.specify/memory/`, `.specify/templates/`,
`.specify/scripts/powershell/`, `.specify/integrations/`,
`.specify/init-options.json`, and `.specify/integration.json`. Version
feature artifacts under `specs/`. Do not version runtime cache or feature-local
state. The optional Git extension and workflow executor were removed because
they are not part of the selected process.

## Path decisions

| Path | Decision | Reason |
|---|---|---|
| `README.md` | Revise | Good product intent, but it describes planned capabilities as if they already exist. |
| `LICENSE` | Keep | Valid MIT license. |
| `AGENTS.md` | Revise | It points to a current plan that does not exist and lacks durable project instructions. |
| `.gitignore` | Keep | Required for Node artifacts, secrets, and Spec Kit runtime state. |
| `docs/` | Keep | Contains the repository decision record and implementation plan. |
| `.specify/memory/constitution.md` | Revise | Valuable governance, but device requirements should apply only to device-facing integrations, not every text-analysis tool. |
| `.specify/templates/spec-template.md` | Revise | Keep the structure; replace generic account/auth examples with MCP analysis examples. |
| `.specify/templates/plan-template.md` | Revise | Assume a single TypeScript MCP server instead of presenting generic web/mobile layouts. |
| `.specify/templates/tasks-template.md` | Revise | Python paths and generic database/auth tasks conflict with TypeScript and Vitest. |
| `.specify/templates/checklist-template.md` | Keep | Part of the selected core Spec Kit command set. |
| `.specify/templates/constitution-template.md` | Keep | Needed if the constitution is regenerated through Spec Kit. |
| `.specify/scripts/powershell/` | Generated/version | Installed workflow runtime required by the selected reproducible setup. |
| `.agents/skills/speckit-*` | Generated/version | Installed prompts required by the selected Codex integration; do not edit as product source. |
| `.specify/integrations/*.manifest.json` | Generated/version | Installation and integrity metadata for the selected setup. |
| `.specify/init-options.json` | Generated/version | Records the selected Codex and PowerShell installation. |
| `.specify/integration.json` | Generated/version | Records the selected integration state. |
| `.specify/extensions/.registry` | Removed | Local extension installation registry. |
| `.specify/extensions/git/` | Removed | Duplicated normal Git/Codex behavior and included broad staging/commit automation. |
| `.specify/extensions/agent-context/` | Keep | Maintains the plan pointer in `AGENTS.md`; execution remains optional. |
| `.specify/extensions.yml` | Keep | Reduced to the optional agent-context hook; automatic execution is disabled. |
| `.specify/workflows/` | Removed | Individual skills provide the selected workflow; registry and downloaded cache had no project value. |
| `.agents/skills/speckit-git-*` | Removed | These skills were generated only by the removed Git extension. |
| Future `specs/` | Keep and version | These are project decisions and implementation artifacts. |

## Immediate corrections

Before implementation:

1. Create the TypeScript project scaffold, tests, examples, and CI.
2. Generate the first feature specification from the implementation plan.

## Missing product files

The minimum implementation baseline should add:

```text
package.json
package-lock.json
tsconfig.json
eslint.config.js
vitest.config.ts
src/
tests/
examples/
.github/workflows/ci.yml
SECURITY.md
```

For stdio transport, `stdout` is exclusively reserved for MCP/JSON-RPC framing;
all diagnostics go to `stderr`. Inputs and evidence extracted from logs must be
size-limited and redacted before being returned or persisted.
