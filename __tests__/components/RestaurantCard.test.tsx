import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import RestaurantCard from '../../src/components/RestaurantCard';

const mockStore = configureStore([]);

describe('RestaurantCard Component', () => {
    const mockRestaurant = {
        id: 1,
        restaurantName: 'Test Restaurant',
        rating: 4.5,
        ratingCount: 120,
        category: 'Italian',
        image_url: 'https://example.com/image.jpg',
        distance_km: 2.5,
        flash_deals_available: true,
        flash_deals_count: 3
    };

    const initialState = {
        restaurant: {
            favoriteRestaurantsIDs: [2, 3]
        }
    };

    let store;

    beforeEach(() => {
        store = mockStore(initialState);
    });

    it('renders restaurant information correctly', () => {
        const {getByText, getByTestId} = render(
            <Provider store={store}>
                <RestaurantCard restaurant={mockRestaurant} onPress={() => {
                }}/>
            </Provider>
        );

        expect(getByText('Test Restaurant')).toBeTruthy();
        expect(getByText('4.5')).toBeTruthy();
        expect(getByText('(120)')).toBeTruthy();
        expect(getByText('Italian')).toBeTruthy();
        expect(getByText('2.5 km')).toBeTruthy();
        expect(getByTestId('flash-deals-badge')).toBeTruthy();
    });

    it('calls onPress when card is pressed', () => {
        const onPressMock = jest.fn();
        const {getByTestId} = render(
            <Provider store={store}>
                <RestaurantCard
                    restaurant={mockRestaurant}
                    onPress={onPressMock}
                    testID="restaurant-card"
                />
            </Provider>
        );

        fireEvent.press(getByTestId('restaurant-card'));
        expect(onPressMock).toHaveBeenCalledWith(mockRestaurant);
    });

    it('displays favorite icon correctly when restaurant is in favorites', () => {
        const favoriteRestaurant = {...mockRestaurant, id: 2};
        const {getByTestId} = render(
            <Provider store={store}>
                <RestaurantCard restaurant={favoriteRestaurant} onPress={() => {
                }}/>
            </Provider>
        );

        expect(getByTestId('favorite-icon-filled')).toBeTruthy();
    });
});