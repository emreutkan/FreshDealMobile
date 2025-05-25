/** @type {import('jest').Config} */
const config = {
    // Replace jest-expo preset with a custom preset configuration
    preset: 'react-native',
    setupFiles: [
        '<rootDir>/__tests__/setup.ts',
        // Add react-native mocks that would normally be included in jest-expo
        './node_modules/react-native-gesture-handler/jestSetup.js'
    ],
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
    },
    testMatch: [
        '**/__tests__/**/*.test.[jt]s?(x)'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    // Use jsdom instead of node environment for React components
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
            presets: ['babel-preset-expo']
        }]
    },
    // Setting rootDir explicitly
    rootDir: '.',
    // Add required configurations that jest-expo would normally provide
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!**/node_modules/**',
        '!**/coverage/**'
    ],
    globals: {
        'ts-jest': {
            tsconfig: {
                jsx: 'react'
            }
        }
    }
};

module.exports = config;

