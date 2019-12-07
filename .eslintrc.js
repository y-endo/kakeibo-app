module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  plugins: ['vue', 'prettier', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    prettier: true,
    'no-var': 2,
    'no-console': 1,
    'no-debugger': 1,
    'vue/max-attributes-per-line': 0,
    'vue/html-self-closing': 0,
    'vue/no-template-shadow': 0
  }
};
