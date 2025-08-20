/** @type {import('stylelint').Config} */
export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-tailwindcss",
  ],
  ignoreFiles: [
    "dist/**",
    "node_modules/**",
    "coverage/**",
    "public/**",
    "e2e/**",
  ],
  rules: {
    "no-empty-source": [true],
    "color-hex-length": "short",
  },
};
