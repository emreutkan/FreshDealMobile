import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {GoBack} from '@/src/features/homeScreen/components/goBack'; // Assuming this is the correct import path

// Mock react-navigation if needed
const mockNavigation = {
    goBack: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => mockNavigation,
}));

describe('GoBack Component', () => {
    beforeEach(() => {
        // Clear mock calls before each test
        mockNavigation.goBack.mockClear();
    });

    test('renders without crashing', () => {
        const {getByTestId} = render(<GoBack/>);
        // Assuming the TouchableOpacity has a testID="go-back-button"
        expect(getByTestId('go-back-button')).toBeTruthy();
    });

    test('calls navigation.goBack when pressed', () => {
        const {getByTestId} = render(<GoBack/>);
        const goBackButton = getByTestId('go-back-button');
        fireEvent.press(goBackButton);
        expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
});

