import React from 'react';
import FavoriteRestaurantCard from '@/src/features/homeScreen/components/FavoriteRestaurantCard';
import {renderWithProviders} from '../testUtils';

// Since we've set up global navigation mocks in testUtils.tsx, we don't need to mock navigation here

describe('FavoriteRestaurantCard Component', () => {
    test('renders without crashing', () => {
        const {getByText} = renderWithProviders(<FavoriteRestaurantCard/>);
        // Check for something that should be in the component when rendered
        expect(getByText('Test Restaurant')).toBeTruthy();
    });
});

