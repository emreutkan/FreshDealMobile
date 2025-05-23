import 'react-native-gesture-handler/jestSetup';

// Initialize global objects
global.window = {};
global.window.addEventListener = () => {
};
global.window.removeEventListener = () => {
};

// Ensure these objects exist before jest-expo tries to modify them
if (!global.navigator) {
    global.navigator = {};
}

if (!global.document) {
    global.document = {};
}

// Mock implementations
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Mock Expo modules
jest.mock('expo-font', () => ({
    isLoaded: jest.fn(() => true),
    loadAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-asset', () => ({
    Asset: {
        fromModule: jest.fn(() => ({downloadAsync: jest.fn()})),
        loadAsync: jest.fn(() => Promise.resolve()),
    },
}));

// Mock for react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => {
    };
    return Reanimated;
});

// Mock for expo-constants
jest.mock('expo-constants', () => ({
    Constants: {
        manifest: {
            extra: {
                apiUrl: 'https://test-api.freshdealapp.com',
            },
        },
    },
    default: {
        expoVersion: '53.0.0',
        manifest: {
            extra: {
                apiUrl: 'https://test-api.freshdealapp.com',
            },
        },
    },
}));

// Mock for react-native
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    return {
        ...RN,
        NativeModules: {
            ...RN.NativeModules,
            ReanimatedModule: {
                configureProps: jest.fn(),
            },
        },
        Platform: {
            ...RN.Platform,
            OS: 'ios',
            select: jest.fn(obj => obj.ios),
        },
    };
});

// Additional setup for testing environment
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: 'ios',
    select: jest.fn(obj => obj.ios),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);