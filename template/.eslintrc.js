module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "@vue/eslint-config-typescript",
    "prettier",
    "prettier/vue",
    /**
     * This does three things:
     * 1. Enables eslint-plugin-prettier.
     * 2. Sets the prettier/prettier rule to "error".
     * 3. Extends the eslint-config-prettier configuration.
     * @ref https://github.com/prettier/eslint-plugin-prettier
     */
    "plugin:prettier/recommended",
  ],
  parser: "vue-eslint-parser",
  plugins: ["prettier", "vue"],
  ignorePatterns: ["public/**/*"],
  // add your custom rules here
  rules: {},
};
