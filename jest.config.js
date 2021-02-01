const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/build/'],
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/build/'],
  transform: tsjPreset.transform,
};
