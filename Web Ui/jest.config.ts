export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["<rootDir>/test/cypress/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/__mocks__/fileMock.js",
    "^.+\\.(css|less)$": "<rootDir>/CSSStub.js",
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  silent: true,
};
