// const { createDefaultPreset } = require('ts-jest');

// const tsJestTransformCfg = createDefaultPreset().transform;

// /** @type {import("jest").Config} **/
// module.exports = {
//   testEnvironment: 'node',
//   transform: {
//     ...tsJestTransformCfg,
//   },
// };

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  collectCoverage: true, // enable coverage collection
  collectCoverageFrom: [
    'src/**/*.ts', // include all source files
    '!src/**/*.d.ts', // ignore TypeScript declaration files
  ],
  coverageDirectory: '<rootDir>/coverage', // output folder
  coverageThreshold: {
    // enforce minimum coverage
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
