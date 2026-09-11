import { createRequire } from "module";

const require = createRequire(import.meta.url);

const tsParser = require("@typescript-eslint/parser");
const nextPluginRaw = require("@next/eslint-plugin-next");
const nextPlugin = nextPluginRaw.default || nextPluginRaw;

const reactHooksRaw = require("eslint-plugin-react-hooks");
const reactHooksPlugin = reactHooksRaw.default || reactHooksRaw;

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "test-results/**",
      "playwright-report/**",
      "local.db*",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;