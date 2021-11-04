module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb/base',
  ],
  parserOptions: {
    ecmaFeatures: {

    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
  ],
  rules: {
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id', '_type'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
