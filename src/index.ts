#!/usr/bin/env node

import { startStdioServer } from "./server/create-server.js";

try {
  await startStdioServer();
} catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown stdio server failure.";
  process.stderr.write(`mcp-mobile-toolkit failed to start: ${message}\n`);
  process.exitCode = 1;
}
