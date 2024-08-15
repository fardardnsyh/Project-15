const esModules = ['@angular'].join('|');

/* eslint-disable */
export default {
  displayName: 'jhh-client-auth-public',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      { tsconfig: '<rootDir>/tsconfig.spec.json' },
    ],
  },
  transformIgnorePatterns: [`node_modules/(?!(${esModules}|.*.mjs$))`],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/jhh-client/auth/public',
};
