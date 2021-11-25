/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js'],
  transform: { '^.+\\.ts?$': 'ts-jest' },
  testPathIgnorePatterns: ['dist/'],
  globals: { 'ts-jest': { diagnostics: false }},
};
