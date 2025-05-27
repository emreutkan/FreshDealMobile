import React from 'react';
import RecentRestaurants from '@/src/features/homeScreen/components/RecentRestaurants';
import {renderWithProviders} from '../testUtils';

describe('RecentRestaurants Component', () => {
    const mockRestaurantData = {
        id: '1',
        restaurantName: 'Test Restaurant',
        image_url: 'https://example.com/image.jpg',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // Provide mock workingDays
        workingHoursStart: '09:00',
        workingHoursEnd: '22:00',
        listings: 5, // Assume some listings are available
    };

    const initialState = {
        restaurant: {
            recentRestaurantIDs: ['1'],
            restaurantsProximity: [mockRestaurantData],
            recentRestaurantsLoading: false,
            // ... other restaurant state properties
        },
        // ... other store slices
    };

    test('renders without crashing', () => {
        const {getByText} = renderWithProviders(<RecentRestaurants/>, {initialState});
        expect(getByText(/Recent Orders/)).toBeTruthy();
        // Check if the restaurant name is rendered, indicating data is processed
        expect(getByText('Test Restaurant')).toBeTruthy();
    });
});

