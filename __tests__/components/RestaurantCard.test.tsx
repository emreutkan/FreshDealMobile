import React from 'react';
import {render} from '@testing-library/react-native';
import RestaurantList from '@/src/features/homeScreen/components/RestaurantCard';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

// Mock necessary hooks and services
jest.mock('@/src/hooks/handleRestaurantPress', () => ({
    useHandleRestaurantPress: () => jest.fn(),
}));

jest.mock('@/src/services/tokenService', () => ({
    tokenService: {
        getToken: () => 'mock-token',
    },
}));

jest.mock('@/src/utils/RestaurantFilters', () => ({
    calculateDistanceToRestaurant: () => 2.5,
    isRestaurantOpen: () => true,
}));

// Mock data for a restaurant
const mockRestaurant = {
    id: 1,
    restaurantName: 'Test Restaurant',
    image_url: 'https://example.com/image.jpg',
    rating: 4.5,
    ratingCount: 123,
    restaurantDescription: 'Delicious food',
    workingDays: [1, 2, 3, 4, 5],
    workingHoursStart: '09:00',
    workingHoursEnd: '21:00',
    latitude: 40.712776,
    longitude: -74.005974,
    delivery: true,
    pickup: true,
    deliveryFee: 0,
    minOrderAmount: 15,
    listings: 5,
    category: 'Fast Food',
};

// Create mock store
const mockStore = configureStore([]);
const store = mockStore({
    restaurant: {
        favoriteRestaurantsIDs: [2, 3],
    },
    address: {
        selectedAddressId: '1',
        addresses: [
            {
                id: '1',
                latitude: 40.715,
                longitude: -74.010,
                address: '123 Test St'
            }
        ]
    }
});

describe('RestaurantList Component', () => {
    test('renders without crashing', () => {
        render(
            <Provider store={store}>
                <RestaurantList restaurants={[mockRestaurant]}/>
            </Provider>
        );
    });
});

