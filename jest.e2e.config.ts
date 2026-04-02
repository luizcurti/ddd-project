export default {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },

  clearMocks: true,

  coverageProvider: "v8",

  testMatch: ["**/*.e2e.spec.ts"],

  testTimeout: 30000,

  // Rodar sequencialmente para evitar conflitos no banco
  maxWorkers: 1,

  globalSetup: "./src/e2e/setup/global-setup.ts",

  forceExit: true,

  testEnvironment: "node",
};
