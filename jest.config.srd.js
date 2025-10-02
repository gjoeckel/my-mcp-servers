// SRD-Focused Jest Configuration
// Simple, Reliable, DRY Testing

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Coverage settings for reliability
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,      // 80% branch coverage
      functions: 80,     // 80% function coverage
      lines: 80,         // 80% line coverage
      statements: 80     // 80% statement coverage
    }
  },

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).js',
    '**/?(*.)+(spec|test).ts'
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Module resolution
  moduleFileExtensions: ['js', 'ts', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },

  // Test timeout (reliability)
  testTimeout: 10000,

  // Clear mocks between tests (reliability)
  clearMocks: true,
  restoreMocks: true,

  // Verbose output for clarity
  verbose: true,

  // Watch mode settings
  watchman: false,

  // Performance optimizations
  maxWorkers: '50%',

  // Error handling
  errorOnDeprecated: true,

  // Global setup for DRY testing
  globalSetup: '<rootDir>/jest.global-setup.js',
  globalTeardown: '<rootDir>/jest.global-teardown.js'
};


