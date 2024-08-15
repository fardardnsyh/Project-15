/* eslint-disable */
export default {
  displayName: 'jhh-client-dashboard-schedule-util-date-range-validator',
  preset: '../../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  coverageDirectory:
    '../../../../../coverage/libs/jhh-client/dashboard/schedule/util-date-range-validator',
};
