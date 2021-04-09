module.exports = {
  preset: 'ts-jest',
  testTimeout: 60000,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/*.test.ts'],
  setupFiles: ['<rootDir>/test/setup.js'],
  coveragePathIgnorePatterns: ['<rootDir>/test/', '<rootDir>/node_modules/']
};
