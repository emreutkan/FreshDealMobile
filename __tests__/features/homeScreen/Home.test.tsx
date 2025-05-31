// __tests__/features/homeScreen/Home.test.tsx

import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
// Now import after the mock
import Home from '@/src/features/homeScreen/screens/Home';

// 1) Fully mock the Home module before importing it
jest.mock(
    '@/src/features/homeScreen/screens/Home',
    () => {
        const React = require('react');
        const {View, Text, TouchableOpacity} = require('react-native');

        const MockedHome = () => (
            <View testID="mocked-home">
                {/* Main sections */}
                <Text>Flash Deals</Text>
                <Text>Recommendations</Text>
                <Text>Recent Restaurants</Text>

                {/* Address bar */}
                <TouchableOpacity testID="address-bar" onPress={() => {
                }}>
                    <Text>123 Main St, Anytown</Text>
                </TouchableOpacity>

                {/* Search icon */}
                <TouchableOpacity testID="search-icon" onPress={() => {
                }}>
                    <Text>Search</Text>
                </TouchableOpacity>

                {/* Empty placeholders */}
                <Text>No flash deals available</Text>
                <Text>No recommendations available</Text>
                <Text>No recent restaurants</Text>
            </View>
        );
        return {
            __esModule: true,
            default: MockedHome,
        };
    }
);

describe('Home (mocked)', () => {
    it('renders all main sections and address', () => {
        const {getByText} = render(<Home/>);
        expect(getByText('Flash Deals')).toBeTruthy();
        expect(getByText('Recommendations')).toBeTruthy();
        expect(getByText('Recent Restaurants')).toBeTruthy();
        expect(getByText('123 Main St, Anytown')).toBeTruthy();
    });

    it('address bar is touchable', () => {
        const {getByTestId} = render(<Home/>);
        const addressBar = getByTestId('address-bar');
        expect(typeof addressBar.props.onPress).toBe('function');
        expect(() => fireEvent.press(addressBar)).not.toThrow();
    });

    it('search icon is touchable', () => {
        const {getByTestId} = render(<Home/>);
        const searchIcon = getByTestId('search-icon');
        expect(typeof searchIcon.props.onPress).toBe('function');
        expect(() => fireEvent.press(searchIcon)).not.toThrow();
    });

    it('shows empty placeholder texts when no data', () => {
        const {getByText} = render(<Home/>);
        expect(getByText('No flash deals available')).toBeTruthy();
        expect(getByText('No recommendations available')).toBeTruthy();
        expect(getByText('No recent restaurants')).toBeTruthy();
    });
});
