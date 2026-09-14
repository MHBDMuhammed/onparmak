import { defineConfig } from "oxlint";

export default defineConfig({
  options: { typeAware: true },
  plugins: ["react", "typescript"],
  env: { browser: true, node: true },
  ignorePatterns: [
    "dist/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ],
  rules: {
    "react/rules-of-hooks": "error",
    "react/exhaustive-deps": "warn",
    "@typescript-eslint/consistent-type-imports": "error",
    // TypingEngine is a deliberately mutable domain object kept outside React state.
    "react/immutability": "off",
    // Persistence errors are reported from the localStorage synchronization effect.
    "react/set-state-in-effect": "off",
    // Metrics and relative dates intentionally read the clock at render time.
    "react/purity": "off",
    // Onparmak processes an NFC keyboard alphabet by Unicode code point, not arbitrary graphemes.
    "typescript/no-misused-spread": "off",
  },
  overrides: [
    {
      files: ["tests/**/*.test.ts"],
      // node:test registers tests at module load; its return values are intentionally unawaited.
      rules: { "typescript/no-floating-promises": "off" },
    },
  ],
});
