module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.test\\.ts$': ['ts-jest', {
            tsconfig: 'tsconfig.test.json'
        }],
    },
    testMatch: ['<rootDir>/src/**/*.test.ts'],
    transformIgnorePatterns: ['/node_modules/', '<rootDir>/dist/'],
};