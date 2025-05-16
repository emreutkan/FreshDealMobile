import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import {NativeModules} from 'react-native';

// Mock the AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock the expo modules that might cause issues during tests
jest.mock('expo-font');
jest.mock('expo-asset');
jest.mock('expo-constants', () => ({
    manifest: {
        extra: {
            apiUrl: 'https://test-api.freshdealapp.com',
        },
    },
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => {
    };
    return Reanimated;
});

// Mock the native modules
NativeModules.StatusBarManager = {
    getHeight: jest.fn(),
    setColor: jest.fn(),
    setStyle: jest.fn(),
    setHidden: jest.fn(),
    setNetworkActivityIndicatorVisible: jest.fn(),
    setBackgroundColor: jest.fn(),
    setTranslucent: jest.fn(),
};

// Mock react-native-maps
jest.mock('react-native-maps', () => {
    const React = require('react');
    return {
        __esModule: true,
        default: class MockMapView extends React.Component {
            render() {
                return null;
            }
        },
        Marker: class MockMarker extends React.Component {
            render() {
                return null;
            }
        },
        Callout: class MockCallout extends React.Component {
            render() {
                return null;
            }
        },
    };
});

// Mock geolocation
const mockGeolocation = {
    getCurrentPosition: jest.fn().mockImplementation((success) => {
        success({
            coords: {
                latitude: 37.7749,
                longitude: -122.4194,
                altitude: null,
                accuracy: 5,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
            },
            timestamp: 1664885137000,
        });
    }),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
    stopObserving: jest.fn(),
};

global.navigator.geolocation = mockGeolocation;

// Mock Image component
jest.mock('react-native/Libraries/Image/Image', () => ({
    __esModule: true,
    default: 'Image',
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Suppress console errors and warnings during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: any[]) => {
    if (
        args[0]?.includes?.('Warning:') ||
        args[0]?.includes?.('The above error occurred') ||
        args[0]?.includes?.('Error:')
    ) {
        return;
    }
    originalConsoleError(...args);
};

console.warn = (...args: any[]) => {
    if (
        args[0]?.includes?.('Warning:') ||
        args[0]?.includes?.('Possible Unhandled Promise Rejection')
    ) {
        return;
    }
    originalConsoleWarn(...args);
};