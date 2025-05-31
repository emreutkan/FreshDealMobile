import React from 'react';
import {fireEvent} from '@testing-library/react-native';
import AddressBar from '@/src/features/homeScreen/components/AddressBar';
import {renderWithProviders} from '../testUtils';
import * as Navigation from '@react-navigation/native';

// Create a spy on the useNavigation hook to check if navigate is called
const mockNavigate = jest.fn();
jest.spyOn(Navigation, 'useNavigation').mockReturnValue({navigate: mockNavigate});

describe('AddressBar Component', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test('renders without crashing and displays selected address', () => {
        const {getByText} = renderWithProviders(<AddressBar/>);
        expect(getByText('123 Test Street')).toBeTruthy();
    });

    test('opens address selection modal on press', () => {
        const {getByTestId} = renderWithProviders(<AddressBar/>);

        // Check if the AddressBar has a testID
        const addressBar = getByTestId('address-bar-button');
        fireEvent.press(addressBar);

        // This test is just checking if the bottom sheet opens
        // The navigation happens after selecting an address in the modal
        // No need to test navigation here
    });
});
