// Mock expo-module dependencies
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => {
    };
    return Reanimated;
});

// Mock expo-font
jest.mock('expo-font', () => ({
    useFonts: () => [true, null],
    loadAsync: jest.fn().mockResolvedValue(true),
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
    preventAutoHideAsync: jest.fn().mockResolvedValue(true),
    hideAsync: jest.fn().mockResolvedValue(true),
}));

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
    setNotificationHandler: jest.fn(),
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
    NavigationContainer: ({children}) => children,
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useRoute: () => ({
        params: {},
    }),
    createNavigationContainerRef: jest.fn().mockReturnValue({}),
}));

// Mock redux
jest.mock('react-redux', () => ({
    useDispatch: () => jest.fn(),
    useSelector: jest.fn((selector) => selector()),
    Provider: ({children}) => children,
}));

// Mock native-stack
jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: () => ({
        Navigator: jest.fn().mockReturnValue(null),
        Screen: jest.fn().mockReturnValue(null),
    }),
}));

// Mock services to avoid actual API calls
jest.mock('../../src/services/tokenService', () => ({
    tokenService: {
        getToken: jest.fn().mockResolvedValue('test-token'),
        setToken: jest.fn(),
        clearToken: jest.fn(),
    },
    initializeTokenService: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(null),
    removeItem: jest.fn().mockResolvedValue(null),
}));

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({top: 0, right: 0, bottom: 0, left: 0}),
    SafeAreaProvider: ({children}) => children,
}));

// Mock the store
jest.mock('../../src/redux/store', () => ({
    store: {
        getState: () => ({
            user: {
                token: 'test-token',
                user: null,
            },
        }),
        dispatch: jest.fn(),
    },
}));