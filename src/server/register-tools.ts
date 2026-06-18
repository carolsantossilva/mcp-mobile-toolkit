import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export type ToolRegistrar = (server: McpServer) => void;

/**
 * Add a registrar here only after that tool's contract, implementation, and
 * required tests are complete. Keeping this list empty is deliberate.
 */
const completedToolRegistrars: readonly ToolRegistrar[] = [];

export function registerTools(
  server: McpServer,
  registrars: readonly ToolRegistrar[] = completedToolRegistrars,
): void {
  initializeEmptyToolRegistry(server);

  for (const register of registrars) {
    register(server);
  }
}

/**
 * McpServer advertises the tools capability when its first tool is registered.
 * Registering and synchronously removing a private bootstrap tool initializes
 * the SDK's list/call handlers while ensuring it can never appear in
 * tools/list.
 */
function initializeEmptyToolRegistry(server: McpServer): void {
  const bootstrap = server.registerTool(
    "__mobile_toolkit_registry_bootstrap",
    {
      description: "Internal registry bootstrap.",
    },
    () => {
      throw new Error("The internal registry bootstrap cannot be invoked.");
    },
  );

  bootstrap.remove();
}
