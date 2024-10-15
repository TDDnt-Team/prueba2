export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["<rootDir>/test/cypress/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    // "^.+\\.tsx?$": "babel-jest", // Usar babel-jest para la transformación
  },
  moduleNameMapper: {
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/__mocks__/fileMock.js",
    "^.+\\.(css|less)$": "<rootDir>/CSSStub.js",
  },
  silent: true,
};
