const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: {
        parse: tsParser.parse.bind(tsParser),
        parseForESLint: tsParser.parseForESLint.bind(tsParser),
      },
      globals: {
        browser: true,
        node: true,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "single"],
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
];
