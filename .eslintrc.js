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
    'plugin:prettier/recommended',
    'plugin:vue/recommended',
    'prettier/vue'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'no-var': 2,
    'no-console': 0,
    'no-debugger': 1,
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': 0,
    'vue/max-attributes-per-line': 0,
    'vue/html-self-closing': 0,
    'vue/no-template-shadow': 0
  }
};
