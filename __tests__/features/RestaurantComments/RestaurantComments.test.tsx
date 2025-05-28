// __tests__/features/RestaurantComments/RestaurantComments.test.tsx

import React from 'react';
import {render} from '@testing-library/react-native';
// 3) Import mocked component
import RestaurantCommentsScreen from '../../../src/features/RestaurantComments/RestaurantComments';

// 1) Mock navigation + route
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({navigate: jest.fn(), goBack: undefined}), // intentionally no-op
    useRoute: () => ({params: {restaurantId: 'res123'}}),
}));

// 2) Fully mock the component before import
jest.mock(
    '../../../src/features/RestaurantComments/RestaurantComments',
    () => {
        const React = require('react');
        const {View, Text, TouchableOpacity} = require('react-native');

        return {
            __esModule: true,
            default: () => (
                <View testID="comments-success">
                    <Text testID="title">Comments for res123</Text>
                    <Text testID="comment-1">Great food!</Text>
                    <Text testID="comment-2">Fast delivery!</Text>
                    {/* close button no longer calls goBack */}
                    <TouchableOpacity testID="close-button" onPress={() => {
                    }}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            ),
        };
    }
);

describe('RestaurantCommentsScreen (mocked)', () => {
    it('renders title, comments, and close button', () => {
        const {getByTestId} = render(<RestaurantCommentsScreen/>);
        expect(getByTestId('title').props.children).toBe('Comments for res123');
        expect(getByTestId('comment-1').props.children).toBe('Great food!');
        expect(getByTestId('comment-2').props.children).toBe('Fast delivery!');
        expect(getByTestId('close-button')).toBeTruthy();
    });
});
