import React from 'react';
import Recommendations from '@/src/features/homeScreen/components/Recommendations';
import {renderWithProviders} from '../testUtils';

describe('Recommendations Component', () => {
    test('renders without crashing', () => {
        const {getByText} = renderWithProviders(<Recommendations/>);
        // Verify that some part of the component renders correctly
        expect(getByText(/Test Restaurant/)).toBeTruthy();
    });
});

