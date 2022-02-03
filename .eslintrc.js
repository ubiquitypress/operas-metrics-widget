module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'arrow-body-style': 'off',
    camelcase: 'off',
    'no-restricted-exports': 'off',
    'no-console': [
      'warn',
      { allow: ['clear', 'info', 'error', 'dir', 'trace'] }
    ],
    'react/function-component-definition': 'off',
    'react/jsx-props-no-spreading': 'off'
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.jsx'],
      env: {
        jest: true
      }
    }
  ]
};
