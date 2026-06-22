import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { once } from "node:events";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import type { CallToolRequest, JSONRPCMessage, ListToolsResult } from "@modelcontextprotocol/sdk/types.js";
import { JSONRPCMessageSchema } from "@modelcontextprotocol/sdk/types.js";

export interface StdioHarnessOptions {
	entrypoint?: string;
	cwd?: string;
	nodeArguments?: readonly string[];
	startupTimeoutMs?: number;
	shutdownTimeoutMs?: number;
}

export interface StdioHarness {
	client: Client;
	process: ChildProcessWithoutNullStreams;
	stderr: readonly string[];
	listTools(): Promise<ListToolsResult>;
	callTool(params: CallToolRequest["params"]): ReturnType<Client["callTool"]>;
	assertProtocolStdout(): void;
	close(): Promise<void>;
}

export async function createStdioHarness(options: StdioHarnessOptions = {}): Promise<StdioHarness> {
	const {
		entrypoint = "dist/index.js",
		cwd = process.cwd(),
		nodeArguments = [],
		startupTimeoutMs = 5_000,
		shutdownTimeoutMs = 2_000,
	} = options;

	const child = spawn(process.execPath, [...nodeArguments, entrypoint], {
		cwd,
		env: { ...process.env },
		stdio: ["pipe", "pipe", "pipe"],
		windowsHide: true,
	});
	const transport = new StrictProcessTransport(child);
	const client = new Client({ name: "mcp-mobile-toolkit-stdio-test-client", version: "0.1.0" }, { capabilities: {} });

	let closed = false;

	try {
		await withTimeout(client.connect(transport), startupTimeoutMs, "Timed out while starting the compiled MCP server.");
	} catch (error) {
		await transport.close();
		throw error;
	}

	return {
		client,
		process: child,
		get stderr() {
			return transport.stderr;
		},
		listTools: () => client.listTools(),
		callTool: (params) => client.callTool(params),
		assertProtocolStdout: () => transport.assertProtocolStdout(),
		close: async () => {
			if (closed) {
				return;
			}
			closed = true;

			await client.close();
			await transport.waitForExit(shutdownTimeoutMs);
			transport.assertProtocolStdout();
		},
	};
}

class StrictProcessTransport {
	onclose?: () => void;
	onerror?: (error: Error) => void;
	onmessage?: (message: JSONRPCMessage) => void;

	readonly stderr: string[] = [];

	private stdoutBuffer = "";
	private stderrBuffer = "";
	private readonly protocolErrors: Error[] = [];
	private started = false;
	private closed = false;

	constructor(private readonly child: ChildProcessWithoutNullStreams) {}

	start(): Promise<void> {
		if (this.started) {
			throw new Error("The stdio test transport has already started.");
		}
		this.started = true;

		this.child.stdout.setEncoding("utf8");
		this.child.stderr.setEncoding("utf8");
		this.child.stdout.on("data", this.handleStdout);
		this.child.stderr.on("data", this.handleStderr);
		this.child.on("error", this.handleChildError);
		this.child.on("exit", this.handleExit);
		return Promise.resolve();
	}

	async send(message: JSONRPCMessage): Promise<void> {
		if (this.closed || !this.child.stdin.writable) {
			throw new Error("The compiled MCP server stdin is not writable.");
		}

		await new Promise<void>((resolve, reject) => {
			this.child.stdin.write(`${JSON.stringify(message)}\n`, (error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}

	close(): Promise<void> {
		if (this.closed) {
			return Promise.resolve();
		}
		this.closed = true;

		this.child.stdout.off("data", this.handleStdout);
		this.child.stderr.off("data", this.handleStderr);
		this.child.off("error", this.handleChildError);
		this.child.off("exit", this.handleExit);

		this.flushTrailingOutput();

		if (this.child.stdin.writable) {
			this.child.stdin.end();
		}
		if (this.child.exitCode === null && this.child.signalCode === null) {
			this.child.kill();
		}

		this.onclose?.();
		return Promise.resolve();
	}

	async waitForExit(timeoutMs: number): Promise<void> {
		if (this.child.exitCode !== null || this.child.signalCode !== null) {
			return;
		}

		try {
			await withTimeout(
				once(this.child, "exit").then(() => undefined),
				timeoutMs,
				"Timed out while stopping the compiled MCP server.",
			);
		} catch (error) {
			this.child.kill("SIGKILL");
			throw error;
		}
	}

	assertProtocolStdout(): void {
		this.flushTrailingOutput();

		if (this.protocolErrors.length > 0) {
			throw new AggregateError(this.protocolErrors, "The compiled server wrote non-protocol bytes to stdout.");
		}
	}

	private readonly handleStdout = (chunk: string): void => {
		this.stdoutBuffer += chunk;

		while (this.stdoutBuffer.includes("\n")) {
			const newline = this.stdoutBuffer.indexOf("\n");

			const line = this.stdoutBuffer.slice(0, newline);
			this.stdoutBuffer = this.stdoutBuffer.slice(newline + 1);
			this.acceptProtocolLine(line);
		}
	};

	private readonly handleStderr = (chunk: string): void => {
		this.stderrBuffer += chunk;

		while (this.stderrBuffer.includes("\n")) {
			const newline = this.stderrBuffer.indexOf("\n");

			this.stderr.push(this.stderrBuffer.slice(0, newline).replace(/\r$/, ""));
			this.stderrBuffer = this.stderrBuffer.slice(newline + 1);
		}
	};

	private readonly handleChildError = (error: Error): void => {
		this.onerror?.(error);
	};

	private readonly handleExit = (code: number | null, signal: NodeJS.Signals | null): void => {
		this.flushTrailingOutput();

		if (!this.closed) {
			this.onerror?.(new Error(`The compiled MCP server exited unexpectedly (${formatExit(code, signal)}).`));
		}
		this.onclose?.();
	};

	private acceptProtocolLine(rawLine: string): void {
		const line = rawLine.replace(/\r$/, "");
		if (line.length === 0) {
			this.protocolErrors.push(new Error("stdout contained an empty line."));
			return;
		}

		try {
			const message = JSONRPCMessageSchema.parse(JSON.parse(line));
			this.onmessage?.(message);
		} catch {
			this.protocolErrors.push(new Error(`stdout contained a non-protocol line (${String(line.length)} bytes).`));
		}
	}

	private flushTrailingOutput(): void {
		if (this.stdoutBuffer.length > 0) {
			const trailing = this.stdoutBuffer;
			this.stdoutBuffer = "";
			this.acceptProtocolLine(trailing);
		}

		if (this.stderrBuffer.length > 0) {
			this.stderr.push(this.stderrBuffer.replace(/\r$/, ""));
			this.stderrBuffer = "";
		}
	}
}

async function withTimeout<T>(operation: Promise<T>, timeoutMs: number, message: string): Promise<T> {
	let timeout: NodeJS.Timeout | undefined;

	try {
		return await Promise.race([
			operation,
			new Promise<never>((_, reject) => {
				timeout = setTimeout(() => reject(new Error(message)), timeoutMs);
			}),
		]);
	} finally {
		if (timeout !== undefined) {
			clearTimeout(timeout);
		}
	}
}

function formatExit(code: number | null, signal: NodeJS.Signals | null): string {
	if (code !== null) {
		return `code ${String(code)}`;
	}
	return `signal ${signal ?? "unknown"}`;
}
