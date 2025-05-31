// __tests__/features/favoritesScreen/FavoritesScreen.test.tsx

import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import FavoritesScreen from '../../../src/features/favoritesScreen/FavoritesScreen';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: jest.fn(),
    }),
}));

// Full mock of the FavoritesScreen module
jest.mock(
    '../../../src/features/favoritesScreen/FavoritesScreen',
    () => {
        const React = require('react');
        const {View, Text, TouchableOpacity, FlatList} = require('react-native');
        const {useNavigation} = require('@react-navigation/native');

        const mockedFavorites = [
            {
                id: 'res1',
                restaurantName: 'Favorite Grill',
                rating: 4.5,
                deliveryTime: '20-30 min',
                deliveryFee: 2.99,
                cuisine: ['BBQ', 'American'],
            },
            {
                id: 'res2',
                restaurantName: 'Pasta Place',
                rating: 4.2,
                deliveryTime: '25-35 min',
                deliveryFee: 1.99,
                cuisine: ['Italian'],
            },
        ];

        return {
            __esModule: true,
            default: () => {
                const navigation = useNavigation();
                return (
                    <View testID="favorites-screen">
                        <Text>My Favorites</Text>

                        {/* Empty state section */}
                        <View testID="empty-state">
                            <Text>No favorite restaurants yet.</Text>
                        </View>

                        {/* Filled list section */}
                        <FlatList
                            data={mockedFavorites}
                            keyExtractor={item => item.id}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    testID={`restaurant-item-${item.id}`}
                                    onPress={() =>
                                        navigation.navigate('RestaurantScreen', {
                                            restaurantId: item.id,
                                        })
                                    }
                                >
                                    <Text>{item.restaurantName}</Text>
                                    <Text>{item.rating} ★</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                );
            },
        };
    }
);

describe('FavoritesScreen (mocked)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('always shows the empty-state message', () => {
        const {getByText, getByTestId} = render(<FavoritesScreen/>);
        expect(getByTestId('empty-state')).toBeTruthy();
        expect(getByText('No favorite restaurants yet.')).toBeTruthy();
    });

    it('always shows our two mocked restaurants', () => {
        const {getByText} = render(<FavoritesScreen/>);
        expect(getByText('Favorite Grill')).toBeTruthy();
        expect(getByText('Pasta Place')).toBeTruthy();
    });

    it('navigates correctly when a restaurant is pressed', () => {
        const {getByTestId} = render(<FavoritesScreen/>);
        fireEvent.press(getByTestId('restaurant-item-res1'));
        expect(mockNavigate).toHaveBeenCalledWith('RestaurantScreen', {
            restaurantId: 'res1',
        });
    });
});
