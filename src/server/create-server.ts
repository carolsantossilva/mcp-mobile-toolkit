import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerTools, type ToolRegistrar } from "./register-tools.js";

export const SERVER_INFO = {
	name: "mcp-mobile-toolkit",
	version: "0.1.0",
} as const;

export interface CreateServerOptions {
	toolRegistrars?: readonly ToolRegistrar[];
}

export function createServer(options: CreateServerOptions = {}): McpServer {
	const server = new McpServer(SERVER_INFO);
	registerTools(server, options.toolRegistrars);
	return server;
}

export async function startStdioServer(options: CreateServerOptions = {}): Promise<McpServer> {
	const server = createServer(options);
	await server.connect(new StdioServerTransport());
	return server;
}
