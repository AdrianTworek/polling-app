import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/e2e/',
    '<rootDir>/tests-examples/',
    '<rootDir>/test-results/',
    '<rootDir>/playwright-report/',
    '<rootDir>/blob-report/',
    '<rootDir>/playwright/.cache/',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest', // Only transform .ts files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!flat)/', // Exclude modules except 'flat' from transformation
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.model.ts',
    '!src/app/**/*.routes.ts',
    '!src/main.ts',
  ],
  coverageReporters: ['html', 'text', 'lcov'],
};

export default config;
