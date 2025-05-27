import React, {ReactElement} from 'react';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react-native';
import {configureStore} from '@reduxjs/toolkit';

// Mock react-navigation
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
            goBack: jest.fn(),
        }),
        useRoute: () => ({
            params: {},
        }),
        useIsFocused: () => true,
        // Mock the NavigationContainer instead of using the real one
        NavigationContainer: ({children}) => children,
    };
});

// Mock native modules that Navigation depends on
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
    get: jest.fn().mockReturnValue({width: 375, height: 812}),
}));

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: 'ios',
    select: jest.fn(obj => obj.ios),
}));

// Default mock state that can be extended per test
const defaultMockState = {
    address: {
        addresses: [
            {
                id: "1",
                title: 'Home',
                address: '123 Test Street',
                street: '123 Test Street',
                district: 'Test District',
                province: 'Test Province',
                isSelected: true,
                city: 'Test City',
                country: 'Test Country',
            }
        ],
        selectedAddressId: "1"
    },
    restaurant: {
        restaurants: [
            {
                id: '1',
                restaurantName: 'Test Restaurant',
                rating: 4.5,
                image_url: 'https://example.com/image.jpg',
                workingDays: ['Monday', 'Tuesday'],
                workingHoursStart: '09:00',
                workingHoursEnd: '18:00',
                listings: 5,
            }
        ],
        favoriteRestaurantsIDs: ['1'],
        recentRestaurantIDs: ['1'],
        restaurantsProximity: [
            {
                id: '1',
                distance: 1.5
            }
        ],
        recommendedRestaurantIDs: ['1'],
        selectedRestaurantListings: [
            {
                id: 1,
                restaurant_id: 1,
                title: 'Test Listing',
                description: 'Test Description',
                image_url: 'https://example.com/image.jpg',
                count: 5,
                original_price: 15.99,
                pick_up_price: 10.99,
                delivery_price: 12.99,
                consume_within: 2,
                available_for_pickup: true,
                available_for_delivery: true,
                fresh_score: 85,
            }
        ],
        isPickup: true,
        recentRestaurantsLoading: false
    },
    cart: {
        cartItems: [],
        loading: false,
        error: null
    }
};

// Create a re-usable test wrapper
export function renderWithProviders(
    ui: ReactElement,
    {
        initialState = {},
        store = configureStore({
            reducer: (state = {...defaultMockState, ...initialState}) => state,
        }),
        ...renderOptions
    } = {}
) {
    function Wrapper({children}: { children: React.ReactNode }) {
        return (
            <Provider store={store}>
                {children}
            </Provider>
        );
    }

    return render(ui, {wrapper: Wrapper, ...renderOptions});
}
