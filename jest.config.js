module.exports = {
  moduleNameMapper: {
    '\\.module\\.scss$': 'identity-obj-proxy'
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  setupFiles: ['./src/__mocks__/client.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect']
};
