// Mocking react-native modules that might cause issues
// Mock NativeAnimatedHelper if it exists to silence Animated warning
try {
    jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
        API: {},
    }));
} catch (e) {
    // ignore module not found
}

// Mock NativePlatformConstantsIOS to provide getConstants for Platform
try {
    jest.mock('react-native/Libraries/Utilities/NativePlatformConstantsIOS', () => ({
        getConstants: () => ({
            osVersion: '0',
            forceTouchAvailable: false,
            interfaceIdiom: 'handset',
            isTesting: false,
            reactNativeVersion: {major: 0, minor: 0, patch: 0, prerelease: null},
            systemName: 'iOS',
            isDisableAnimations: false,
            isMacCatalyst: false
        })
    }));
} catch (e) {
    // ignore if missing
}

// Mock Dimensions module to avoid native getConstants dependencies
try {
    jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
        get: jest.fn().mockReturnValue({width: 375, height: 812}),
        set: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    }));
} catch (e) {
    // ignore if missing
}

// Mock NativeDeviceInfo to provide Dimensions for Dimensions.set
try {
    jest.mock('react-native/Libraries/Utilities/NativeDeviceInfo', () => ({
        getConstants: () => ({
            Dimensions: {
                window: {width: 375, height: 812},
                screen: {width: 375, height: 812}
            }
        })
    }));
} catch (e) {
    // ignore if missing
}

// Mock TurboModuleRegistry to provide DeviceInfo constants and avoid missing DevMenu module
try {
    jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
        // Provide DeviceInfo.getConstants for Dimensions and stub other modules
        get: jest.fn((name) => {
            if (name === 'DeviceInfo') {
                return {
                    getConstants: () => ({
                        Dimensions: {
                            window: {width: 375, height: 812},
                            screen: {width: 375, height: 812}
                        }
                    })
                };
            }
            return {};
        }),
        getEnforcing: jest.fn((name) => {
            if (name === 'DeviceInfo') {
                return {
                    getConstants: () => ({
                        Dimensions: {
                            window: {width: 375, height: 812},
                            screen: {width: 375, height: 812}
                        }
                    })
                };
            }
            return {};
        }),
    }));
} catch (e) {
    // ignore if missing
}

// Mock React Native components
jest.mock('react-native', () => {
    return {
        // StyleSheet mock
        StyleSheet: {
            create: jest.fn((styles) => styles),
        },
        // Stub core components used in tests
        View: 'View',
        Text: 'Text',
        Image: 'Image',
        FlatList: 'FlatList',
        ScrollView: 'ScrollView',
        TextInput: 'TextInput',
        TouchableOpacity: 'TouchableOpacity',
        // Alert mock
        Alert: {
            alert: jest.fn(),
        },
        // Dimensions mock
        Dimensions: {
            get: jest.fn().mockReturnValue({width: 375, height: 812}),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        },
        // Animated mock
        Animated: {
            event: jest.fn(() => jest.fn()),
            timing: jest.fn(() => ({start: jest.fn()})), // Add this line to mock Animated.timing
            Value: jest.fn(() => ({
                interpolate: jest.fn(),
                setValue: jest.fn(),
                addListener: jest.fn(),
                removeListener: jest.fn(),
                value: 0,
            })),
            View: 'AnimatedView',
            FlatList: 'AnimatedFlatList',
            ScrollView: 'AnimatedScrollView',
        },
        // Platform mock
        Platform: {
            OS: 'ios',
            Version: 0,
            constants: {
                osVersion: '0',
                forceTouchAvailable: false,
                interfaceIdiom: 'handset',
                isTesting: false,
                reactNativeVersion: {major: 0, minor: 0, patch: 0, prerelease: null},
                systemName: 'iOS',
                isDisableAnimations: false,
                isMacCatalyst: false,
            },
            select: (spec: any) => spec.ios ?? spec.default,
        },
        // Easing mock
        Easing: {linear: jest.fn(), ease: jest.fn()},
        // NativeModules stub
        NativeModules: {},
    } as any;
});

// Mock the Haptics module
jest.mock('@/src/utils/Haptics', () => ({
    lightHaptic: jest.fn(),
    mediumHaptic: jest.fn(),
    heavyHaptic: jest.fn(),
}));

// Mock react-redux hooks
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn().mockReturnValue(jest.fn()),
    useSelector: jest.fn(),
}));

// Mock bottom sheet without using JSX
jest.mock('@gorhom/bottom-sheet', () => ({
    BottomSheetModal: 'BottomSheetModal',
    BottomSheetScrollView: 'BottomSheetScrollView',
}));

// Mock vector icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock global fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
    })
) as jest.Mock;

// Silence console warnings and errors during tests
jest.spyOn(console, 'error').mockImplementation(() => {
});
jest.spyOn(console, 'warn').mockImplementation(() => {
});

// Mock ScrollContext
jest.mock('@/src/features/RestaurantScreen/RestaurantDetails', () => {
    const {Animated} = require('react-native');
    const React = require('react');

    // Create a real context with default values
    const ScrollContext = React.createContext({
        scrollY: new Animated.Value(0),
        headerHeight: 100,
        setHeaderHeight: jest.fn()
    });

    return {
        ScrollContext
    };
});

// Mock date-fns
jest.mock('date-fns', () => ({
    addHours: jest.fn(() => new Date()),
    format: jest.fn(() => 'May 25, 2025')
}));

