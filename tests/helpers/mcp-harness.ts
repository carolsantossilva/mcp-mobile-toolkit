import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { CallToolRequest, ListToolsResult } from "@modelcontextprotocol/sdk/types.js";

import { createServer, type CreateServerOptions } from "../../src/server/create-server.js";

export interface McpHarness {
	client: Client;
	server: ReturnType<typeof createServer>;
	listTools(): Promise<ListToolsResult>;
	callTool(params: CallToolRequest["params"]): ReturnType<Client["callTool"]>;
	close(): Promise<void>;
}

export async function createMcpHarness(options: CreateServerOptions = {}): Promise<McpHarness> {
	const server = createServer(options);
	const client = new Client({ name: "mcp-mobile-toolkit-test-client", version: "0.1.0" }, { capabilities: {} });
	const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

	await server.connect(serverTransport);

	try {
		await client.connect(clientTransport);
	} catch (error) {
		await server.close();
		throw error;
	}

	let closed = false;

	return {
		client,
		server,
		listTools: () => client.listTools(),
		callTool: (params) => client.callTool(params),
		close: async () => {
			if (closed) {
				return;
			}
			closed = true;
			await client.close();
			await server.close();
		},
	};
}
