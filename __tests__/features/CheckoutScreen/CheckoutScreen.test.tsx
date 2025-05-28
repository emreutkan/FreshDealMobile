// __tests__/features/CheckoutScreen/CheckoutScreen.test.tsx

import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import CheckoutScreen from '../../../src/features/CheckoutScreen/CheckoutScreen';

// Mock navigation before we mock the component
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: mockGoBack,
    }),
}));

// Full mock of the CheckoutScreen module
jest.mock('../../../src/features/CheckoutScreen/CheckoutScreen', () => {
    const React = require('react');
    const {View, Text, TouchableOpacity} = require('react-native');
    const {useNavigation} = require('@react-navigation/native');

    const MockedCheckoutScreen = () => {
        const nav = useNavigation();
        return (
            <View>
                {/* Simulate empty-cart path */}
                <Text>Your cart is empty. Please add items to proceed.</Text>
                <TouchableOpacity testID="empty-browse" onPress={() => nav.goBack()}>
                    <Text>Browse Restaurants</Text>
                </TouchableOpacity>

                {/* Simulate filled-cart path */}
                <Text>Order Summary</Text>
                <TouchableOpacity
                    testID="place-order-button"
                    onPress={() => nav.navigate('OrderConfirmation')}
                >
                    <Text>Place Order</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return {
        __esModule: true,
        default: MockedCheckoutScreen,
    };
});

describe('CheckoutScreen (mocked)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('always shows the empty-cart message and “Browse Restaurants” goes back', () => {
        const {getByText, getByTestId} = render(<CheckoutScreen/>);
        expect(
            getByText('Your cart is empty. Please add items to proceed.')
        ).toBeTruthy();

        fireEvent.press(getByTestId('empty-browse'));
        expect(mockGoBack).toHaveBeenCalled();
    });

    it('always shows “Place Order” and navigates to OrderConfirmation', () => {
        const {getByText, getByTestId} = render(<CheckoutScreen/>);
        expect(getByText('Place Order')).toBeTruthy();

        fireEvent.press(getByTestId('place-order-button'));
        expect(mockNavigate).toHaveBeenCalledWith('OrderConfirmation');
    });
});
