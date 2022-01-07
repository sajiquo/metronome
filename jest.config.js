
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
    "^.+\\.mdx?$": "@storybook/addon-docs/jest-transform-mdx"
  },
  moduleNameMapper: {
    "\\.s?css$": "<rootDir>/__mocks__/styleMock.js"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverageFrom: ["**/*.{ts,tsx}", "!**/node_modules/*", "!**/*.d.ts", "!**/*config*", "!**/*.stories.*"],
  testEnvironment: "jsdom",
};
