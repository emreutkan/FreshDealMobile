import React from 'react';
import {act, fireEvent, render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import HomeScreen from '../../src/features/homeScreen/screens/Home';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

// Mock geolocation
jest.mock('react-native-geolocation-service', () => ({
    getCurrentPosition: jest.fn((success) => success({
        coords: {
            latitude: 40.7128,
            longitude: -74.0060,
        }
    })),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('HomeScreen', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            user: {
                token: 'test-token',
                isAuthenticated: true,
            },
            address: {
                addresses: [
                    {
                        id: '1',
                        title: 'Home',
                        street: '123 Main St',
                        district: 'Downtown',
                        is_primary: true,
                    }
                ],
                selectedAddressId: '1',
            },
            restaurant: {
                restaurantsProximity: [
                    {
                        id: 1,
                        restaurantName: 'Test Restaurant',
                        rating: 4.5,
                        category: 'Italian',
                        image_url: 'https://example.com/image.jpg',
                    }
                ],
                restaurantsProximityLoading: false,
                recentRestaurantIDs: [1],
                recentRestaurantsLoading: false,
                flashDealsRestaurants: [
                    {
                        id: 2,
                        restaurantName: 'Flash Deal Restaurant',
                        flash_deals_count: 3,
                    }
                ],
                flashDealsLoading: false,
            }
        });
    });

    it('renders HomeScreen correctly', async () => {
        let component;

        await act(async () => {
            component = render(
                <Provider store={store}>
                    <HomeScreen/>
                </Provider>
            );
        });

        const {getByText, getAllByText} = component;

        // Check address section
        expect(getByText('123 Main St, Downtown')).toBeTruthy();

        // Check restaurant sections
        expect(getByText('Restaurants Near You')).toBeTruthy();
        expect(getByText('Test Restaurant')).toBeTruthy();

        // Check flash deals section
        expect(getByText('Flash Deals')).toBeTruthy();
        expect(getByText('Flash Deal Restaurant')).toBeTruthy();
    });

    it('navigates to restaurant details when a restaurant card is pressed', async () => {
        let component;

        await act(async () => {
            component = render(
                <Provider store={store}>
                    <HomeScreen/>
                </Provider>
            );
        });

        const {getByText} = component;

        // Find and press the restaurant card
        const restaurantCard = getByText('Test Restaurant');
        fireEvent.press(restaurantCard);

        // Check that navigation was called with the correct parameters
        expect(mockNavigate).toHaveBeenCalledWith('RestaurantDetails', {restaurantId: 1});
    });
});