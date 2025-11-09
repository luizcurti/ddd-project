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
  
  // Coleta cobertura dos arquivos TypeScript
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.interface.ts",
  ],
  
  // Limites de cobertura
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  
  // Ignora arquivos específicos para cobertura
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    ".spec.ts$",
    ".interface.ts$",
  ],
};
