import baseConfig from "@repo/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["./react-email/**"],
  },
  ...baseConfig,
];
