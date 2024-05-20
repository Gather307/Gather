// eslint.config.js
const { ESLint } = require("eslint");

const config = {
  files: ["**/*.ts", "**/*.js"],
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    parser: "@typescript-eslint/parser",
    globals: {
      browser: true,
      node: true,
    },
  },
  plugins: {
    "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
  },
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "single"],
  },
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
};

module.exports = config;
