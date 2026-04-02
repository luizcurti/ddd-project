/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  transform: {
    "^.+\.(t|j)sx?$": ["@swc/jest"],
  },
  
  clearMocks: true,
  
  coverageProvider: "v8",
  
  // Collect coverage from TypeScript source files
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.interface.ts",
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  
  // Paths excluded from coverage collection
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    ".spec.ts$",
    ".interface.ts$",
    "database-config.ts$",
  ],
};
