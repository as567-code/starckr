/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    '../config/configMixpanel': '<rootDir>/src/__mocks__/configMixpanel.ts',
    '../../config/configMixpanel': '<rootDir>/src/__mocks__/configMixpanel.ts',
  },
};
