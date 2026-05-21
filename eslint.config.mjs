// Minimal flat ESLint config. The heavy correctness check runs inside
// `next build` (TypeScript). This config keeps lint output meaningful
// without pulling in `next/core-web-vitals` via FlatCompat, which has a
// known circular-import bug on Next 16 + ESLint 9.

import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      "lib/generated/**",
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
    },
  },
  {
    // CLI scripts (seed, codegen) legitimately print progress to stdout.
    files: ["prisma/**/*.ts", "scripts/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "no-debugger": "error",
    },
  },
];
