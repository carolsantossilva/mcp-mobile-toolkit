import { defineConfig, defineProject } from "vitest/config";

const sharedProjectConfig = {
  environment: "node",
  globals: false,
  restoreMocks: true,
  clearMocks: true,
  mockReset: true,
  passWithNoTests: true,
  testTimeout: 5_000,
  hookTimeout: 5_000,
} as const;

export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [
      defineProject({
        test: {
          ...sharedProjectConfig,
          name: "unit",
          include: ["tests/unit/**/*.test.ts"],
        },
      }),
      defineProject({
        test: {
          ...sharedProjectConfig,
          name: "contract",
          include: ["tests/contract/**/*.test.ts"],
        },
      }),
      defineProject({
        test: {
          ...sharedProjectConfig,
          name: "integration",
          include: ["tests/integration/**/*.test.ts"],
          testTimeout: 15_000,
          hookTimeout: 15_000,
          sequence: {
            concurrent: false,
          },
        },
      }),
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html", "lcov"],
      reportsDirectory: "coverage",
      include: ["src/**/*.ts"],
      exclude: ["src/index.ts"],
      clean: true,
      reportOnFailure: true,
    },
  },
});
