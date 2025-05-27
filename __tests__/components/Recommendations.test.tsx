import React from 'react';
import Recommendations from '@/src/features/homeScreen/components/Recommendations';
import {render} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';

// Mock the useHandleRestaurantPress hook
jest.mock('@/src/hooks/handleRestaurantPress', () => ({
    useHandleRestaurantPress: () => jest.fn(),
}));

// Mock the Redux state directly for this test
const mockState = {
    recommendation: {
        recommendationIds: ['1'],
        loading: false,
        error: null,
        status: 'succeeded'
    },
    restaurant: {
        restaurantsProximity: [
            {
                id: '1',
                restaurantName: 'Test Restaurant',
                rating: 4.5,
                image_url: 'https://example.com/image.jpg',
                workingDays: ['Monday', 'Tuesday'],
                workingHoursStart: '09:00',
                workingHoursEnd: '18:00',
                listings: 5,
                distance: 1.5
            }
        ]
    }
};

// Create a mock store
const mockStore = configureStore({
    reducer: () => mockState,
    preloadedState: mockState
});

describe('Recommendations Component', () => {
    test('renders without crashing', () => {
        const {getByText} = render(
            <Provider store={mockStore}>
                <NavigationContainer>
                    <Recommendations/>
                </NavigationContainer>
            </Provider>
        );

        // Verify that component renders correctly
        expect(getByText('Recommended For You')).toBeTruthy();
    });
});

