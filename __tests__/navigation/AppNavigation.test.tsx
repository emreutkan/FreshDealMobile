import React from 'react';
import {render} from '@testing-library/react-native';
import AppContent from '../../src/app';

// Mock all the navigation components and screens
jest.mock('@react-navigation/native', () => ({
    NavigationContainer: ({children}) => <>{children}</>,
    useNavigation: () => ({navigate: jest.fn()}),
    useRoute: () => ({params: {}}),
}));

jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: () => ({
        Navigator: ({children}) => <>{children}</>,
        Screen: ({name}) => <div>{name}</div>,
    }),
}));

// Mock all your screens
jest.mock('../../src/features/homeScreen/screens/Home', () => 'HomeScreen');
jest.mock('../../src/features/LoginRegister/screens/Landing', () => 'Landing');
jest.mock('../../src/features/AddressSelectionScreen/addressSelectionScreen', () => 'AddressSelectionScreen');
jest.mock('../../src/features/RestaurantScreen/RestaurantDetails', () => 'RestaurantDetails');
jest.mock('../../src/features/favoritesScreen/FavoritesScreen', () => 'FavoritesScreen');
jest.mock('../../src/features/CartScreen/CartScreen', () => 'CartScreen');
jest.mock('../../src/features/OrdersScreen/Orders', () => 'Orders');
jest.mock('../../src/features/OrdersScreen/OrderDetails', () => 'OrderDetails');
jest.mock('../../src/features/accountScreen/accountScreen', () => 'AccountScreen');
jest.mock('../../src/features/CheckoutScreen/CheckoutScreen', () => 'CheckoutScreen');
jest.mock('../../src/features/RestaurantComments/RestaurantComments', () => 'RestaurantComments');
jest.mock('../../src/features/rankingsScreen/RankingsScreen', () => 'RankingsScreen');
jest.mock('../../src/features/AchievementsScreen/AchievementsScreen', () => 'AchievementsScreen');

// Mock the gesture handler
jest.mock('react-native-gesture-handler', () => ({
    GestureHandlerRootView: ({children}) => <>{children}</>,
}));

// Mock the bottom sheet
jest.mock('@gorhom/bottom-sheet', () => ({
    BottomSheetModalProvider: ({children}) => <>{children}</>,
}));

// Mock the navigation ref
jest.mock('../../src/utils/navigation', () => ({
    navigationRef: {},
    RootStackParamList: {},
}));

// Mock the NotificationsProvider
jest.mock('../../src/providers/NotificationProvider', () => ({
    NotificationsProvider: ({children}) => <>{children}</>,
}));

describe('App Navigation', () => {
    it('renders the app navigator without crashing', () => {
        // This test simply verifies that the app navigator renders without throwing an error
        // Due to the complexity of mocking all the dependencies, we're just testing that it doesn't crash
        expect(() => render(<AppContent/>)).not.toThrow();
    });
});