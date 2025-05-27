import React from 'react';
import Header from '@/src/features/homeScreen/components/Header';
import {renderWithProviders} from '../testUtils';

describe('Header Component', () => {
    test('renders without crashing', () => {
        const {getByTestId} = renderWithProviders(<Header/>);
        expect(getByTestId('address-bar-button')).toBeTruthy();
    });
});

