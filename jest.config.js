/** @type {import('jest').Config} */
const config = {
    preset: 'jest-expo',
    setupFiles: ['<rootDir>/__tests__/setup.ts'],
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
    testEnvironment: 'node',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
            presets: ['babel-preset-expo']
        }]
    },
    globals: {
        'ts-jest': {
            tsconfig: {
                jsx: 'react'
            }
        }
    }
};

module.exports = config;