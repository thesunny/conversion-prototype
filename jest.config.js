module.exports = {
  /**
   * The .dist directory compiles the typescript API files which are sometimes
   * updated for a test. When they get written to, if we don't ignore them,
   * the test runs again. It does it twice in the .dist but in some other
   * directories, it will loop forever.
   */
  modulePathIgnorePatterns: [
    "_methods[.]ts",
    "<rootDir>/.build/",
    "<rootDir>/cypress/",
  ],
  setupFiles: ["./jest.setup.js"],
}

// apiMerge("lib/api-merge/sample", "lib/api-merge/sample/index.ts")
// apiMerge("api-server/test/api", "api-server/test/api/index.ts")
// apiMerge("api", "api/index.ts")
