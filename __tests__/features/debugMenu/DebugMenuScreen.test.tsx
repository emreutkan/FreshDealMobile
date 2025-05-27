import React from 'react';
import {fireEvent, waitFor} from '@testing-library/react-native';
import {renderWithProviders} from '../../testUtils'; // Assuming testUtils is one level up
import DebugMenuScreen from '@/src/features/debugMenu/DebugMenuScreen';
import {tokenService} from '@/src/services/tokenService';
import * as restaurantThunks from '@/src/redux/thunks/restaurantThunks';

// Mock tokenService
jest.mock('@/src/services/tokenService', () => ({
    tokenService: {
        getToken: jest.fn(),
        setToken: jest.fn(), // Mock other methods if they are used directly or indirectly
        removeToken: jest.fn(),
    },
}));

// Mock specific thunks that are dispatched
jest.mock('@/src/redux/thunks/restaurantThunks', () => ({
    ...jest.requireActual('@/src/redux/thunks/restaurantThunks'), // Import and retain other thunks
    getRecentRestaurantsThunk: jest.fn(() => () => Promise.resolve({data: 'recent restaurants'})),
    getRestaurantsByProximity: jest.fn(() => () => Promise.resolve({data: 'restaurants by proximity'})),
    getListingsThunk: jest.fn(() => () => Promise.resolve({data: 'listings'})),
}));
jest.mock('@/src/redux/thunks/userThunks', () => ({
    ...jest.requireActual('@/src/redux/thunks/userThunks'),
    getFavoritesThunk: jest.fn(() => () => Promise.resolve({data: 'favorites'})),
}));
jest.mock('@/src/redux/thunks/cartThunks', () => ({
    fetchCart: jest.fn(() => () => Promise.resolve({data: 'cart'})),
}));
jest.mock('@/src/redux/thunks/recommendationThunks', () => ({
    getRecommendationsThunk: jest.fn(() => () => Promise.resolve({data: 'recommendations'})),
}));


const mockInitialState = {
    user: {
        currentUser: {id: '1', name: 'Test User'},
        loading: false,
        error: null,
    },
    restaurant: {
        restaurants: [],
        selectedRestaurant: null,
        selectedRestaurantListings: [],
        loading: false,
        error: null,
        favoriteRestaurantsIDs: [],
        recentRestaurantIDs: [],
        restaurantsProximity: [],
        recommendedRestaurantIDs: [],
        isPickup: true,
        recentRestaurantsLoading: false,
    },
    cart: {
        cartItems: [],
        loading: false,
        error: null,
    },
    address: {
        addresses: [],
        selectedAddressId: null,
        loading: false,
        error: null,
    },
    search: {
        searchQuery: '',
        searchCategory: 'All',
        searchFilters: {},
        searchResults: [],
        loading: false,
        error: null,
    },
    purchase: {
        purchaseHistory: [],
        loading: false,
        error: null,
    },
    // Add other relevant slices of your Redux state
};

describe('DebugMenuScreen', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        (tokenService.getToken as jest.Mock).mockResolvedValue('mock-test-token');
    });

    test('renders initial sections and system information', async () => {
        const {getByText, findByText} = renderWithProviders(<DebugMenuScreen/>, {initialState: mockInitialState});

        expect(getByText('Debug Menu')).toBeTruthy();
        expect(getByText('System Information')).toBeTruthy();
        expect(getByText('Debug Tools')).toBeTruthy();
        expect(getByText('API Testing')).toBeTruthy();
        expect(getByText('Platform:')).toBeTruthy();
        expect(getByText('React Native')).toBeTruthy();

        // Wait for token to be displayed
        const tokenValue = await findByText('mock-test-token', {}, {timeout: 2000});
        expect(tokenValue).toBeTruthy();
    });

    test('toggles Redux state inspection section', async () => {
        const {getByText, queryByText, findByText} = renderWithProviders(
            <DebugMenuScreen/>, {initialState: mockInitialState});

        const inspectReduxButton = getByText('Inspect Redux State');
        expect(queryByText('User State')).toBeNull(); // Initially hidden

        fireEvent.press(inspectReduxButton);
        await findByText('User State'); // Wait for it to appear
        expect(getByText('User State')).toBeTruthy();
        expect(getByText('Restaurant State')).toBeTruthy();

        fireEvent.press(inspectReduxButton);
        await waitFor(() => expect(queryByText('User State')).toBeNull()); // Wait for it to disappear
    });

    test('displays "Not available" if token is null', async () => {
        (tokenService.getToken as jest.Mock).mockResolvedValue(null);
        const {findByText} = renderWithProviders(<DebugMenuScreen/>, {initialState: mockInitialState});
        const tokenValue = await findByText('Not available');
        expect(tokenValue).toBeTruthy();
    });

    test('calls getRecentRestaurantsThunk on "Test Recent Restaurants" button press', async () => {
        const {getByText, findByText} = renderWithProviders(<DebugMenuScreen/>, {initialState: mockInitialState});

        const testRecentButton = getByText('Test Recent Restaurants');
        fireEvent.press(testRecentButton);

        // Check for loading indicator (optional, depends on your UI)
        // await findByText('Loading...'); // Or however your loading state is indicated

        expect(restaurantThunks.getRecentRestaurantsThunk).toHaveBeenCalledTimes(1);

        // Check for results display
        await findByText(/recent restaurants/i); // Check if results are displayed
    });

    // Add more tests for other API buttons similarly
    // Example for "Test Get Favorites"
    test('calls getFavoritesThunk on "Test Get Favorites" button press', async () => {
        const {getByText, findByText} = renderWithProviders(<DebugMenuScreen/>, {initialState: mockInitialState});
        const getFavoritesThunk = require('@/src/redux/thunks/userThunks').getFavoritesThunk;


        const testFavoritesButton = getByText('Test Get Favorites');
        fireEvent.press(testFavoritesButton);

        expect(getFavoritesThunk).toHaveBeenCalledTimes(1);
        await findByText(/favorites/i);
    });

    test('calls getRestaurantsByProximity on "Test Restaurants By Proximity" button press', async () => {
        const {getByText, findByText} = renderWithProviders(<DebugMenuScreen/>, {initialState: mockInitialState});

        const testProximityButton = getByText('Test Restaurants By Proximity');
        fireEvent.press(testProximityButton);

        expect(restaurantThunks.getRestaurantsByProximity).toHaveBeenCalledTimes(1);
        await findByText(/restaurants by proximity/i);
    });

    test('calls getListingsThunk on "Test Get Listings" button press if restaurant is selected', async () => {
        const stateWithSelectedRestaurant = {
            ...mockInitialState,
            restaurant: {
                ...mockInitialState.restaurant,
                selectedRestaurant: {id: '123', name: 'Test Restaurant'}, // Ensure a restaurant is selected
            },
        };
        const {getByText, findByText} = renderWithProviders(
            <DebugMenuScreen/>, {initialState: stateWithSelectedRestaurant});

        const testListingsButton = getByText('Test Get Listings');
        fireEvent.press(testListingsButton);

        expect(restaurantThunks.getListingsThunk).toHaveBeenCalledTimes(1);
        expect(restaurantThunks.getListingsThunk).toHaveBeenCalledWith({restaurantId: '123'});
        await findByText(/listings/i);
    });

    test('shows error for "Test Get Listings" if no restaurant is selected', async () => {
        const {getByText, findByText} = renderWithProviders(<DebugMenuScreen/>, {initialState: mockInitialState}); // No selected restaurant

        const testListingsButton = getByText('Test Get Listings');
        fireEvent.press(testListingsButton);

        expect(restaurantThunks.getListingsThunk).not.toHaveBeenCalled();
        await findByText(/No restaurant selected/i);
    });

    test('calls getRecommendationsThunk on "Test Recommended Restaurants" button press', async () => {
        const {getByText, findByText} = renderWithProviders(<DebugMenuScreen/>, {initialState: mockInitialState});
        const getRecommendationsThunk = require('@/src/redux/thunks/recommendationThunks').getRecommendationsThunk;

        const testRecommendationsButton = getByText('Test Recommended Restaurants');
        fireEvent.press(testRecommendationsButton);

        expect(getRecommendationsThunk).toHaveBeenCalledTimes(1);
        await findByText(/recommendations/i);
    });

    test('calls fetchCart on "Test Get Cart" button press', async () => {
        const {getByText, findByText} = renderWithProviders(<DebugMenuScreen/>, {initialState: mockInitialState});
        const fetchCart = require('@/src/redux/thunks/cartThunks').fetchCart;

        const testCartButton = getByText('Test Get Cart');
        fireEvent.press(testCartButton);

        expect(fetchCart).toHaveBeenCalledTimes(1);
        await findByText(/cart/i);
    });

});
