module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    'quotes': ['error', 'single'],
    'semi': ['error', 'always']
  }
};
