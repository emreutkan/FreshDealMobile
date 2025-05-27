import React from 'react';
import RecentRestaurants from '@/src/features/homeScreen/components/RecentRestaurants';
import {renderWithProviders} from '../testUtils';

describe('RecentRestaurants Component', () => {
    test('renders without crashing', () => {
        const {getByText} = renderWithProviders(<RecentRestaurants/>);
        expect(getByText(/Recent Orders/)).toBeTruthy();
    });
});

