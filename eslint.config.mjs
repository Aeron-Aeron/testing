import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["**/*.ts"],
  ignores: ["dist", "node_modules"],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: "./tsconfig.eslint.json",
      sourceType: "module",
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  rules: {},
});
