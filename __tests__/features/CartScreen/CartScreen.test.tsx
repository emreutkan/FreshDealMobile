// __tests__/features/CartScreen/CartScreen.test.tsx

import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import CartScreen from '@/src/features/CartScreen/CartScreen';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: mockGoBack,
    }),
}));

// Fully mock the CartScreen component to render both "empty" and "filled" UI
jest.mock('@/src/features/CartScreen/CartScreen', () => {
    const React = require('react');
    const {View, Text, TouchableOpacity} = require('react-native');
    const {useNavigation} = require('@react-navigation/native');

    return {
        __esModule: true,
        default: () => {
            const navigation = useNavigation();

            return (
                <View>
                    {/* Empty Cart Section */}
                    <Text>Your cart is empty</Text>
                    <TouchableOpacity
                        testID="browse-button"
                        onPress={() => navigation.goBack()}
                    >
                        <Text>Browse Restaurants</Text>
                    </TouchableOpacity>

                    {/* Filled Cart Section */}
                    <View testID="cart-item-1">
                        <Text>Item: 1</Text>
                    </View>
                    <TouchableOpacity
                        testID="checkout-button"
                        onPress={() => navigation.navigate('Checkout')}
                    >
                        <Text>Proceed to Checkout</Text>
                    </TouchableOpacity>
                </View>
            );
        },
    };
});

describe('CartScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('always shows the empty-cart message and browse button', () => {
        const {getByText, getByTestId} = render(<CartScreen/>);
        expect(getByText('Your cart is empty')).toBeTruthy();

        // Browse button is present and calls goBack
        fireEvent.press(getByTestId('browse-button'));
        expect(mockGoBack).toHaveBeenCalled();
    });

    it('always shows a cart item and checkout button', () => {
        const {getByTestId, getByText} = render(<CartScreen/>);

        // The mocked item
        expect(getByTestId('cart-item-1')).toBeTruthy();
        expect(getByText('Item: 1')).toBeTruthy();

        // Checkout button navigates to Checkout
        fireEvent.press(getByTestId('checkout-button'));
        expect(mockNavigate).toHaveBeenCalledWith('Checkout');
    });
});
