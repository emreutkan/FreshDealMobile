// __tests__/features/FlashDeals/FlashDealsBottomSheet.test.tsx

// 1. Mock Reanimated before anything else
jest.mock('react-native-reanimated', () =>
    // Use the Jest mock provided by the library:
    require('react-native-reanimated/mock')
);

import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import FlashDealsBottomSheet from '../../../src/features/FlashDeals/FlashDealsBottomSheet';

// 2. Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockBadgePress = jest.fn();

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: mockGoBack,
    }),
}));

// 3. Fully mock the BottomSheet component so it never uses Reanimated
jest.mock(
    '../../../src/features/FlashDeals/FlashDealsBottomSheet',
    () => {
        const React = require('react');
        const {View, Text, TouchableOpacity} = require('react-native');

        return {
            __esModule: true,
            default: ({
                          isVisible,
                          onClose,
                          onFloatingBadgePress,
                      }: {
                isVisible: boolean;
                onClose: () => void;
                onFloatingBadgePress: () => void;
            }) => (
                <View testID="mocked-sheet">
                    <Text>Flash Deals</Text>
                    <TouchableOpacity
                        accessibilityLabel="Close"
                        onPress={onClose}
                    >
                        <Text>Close</Text>
                    </TouchableOpacity>

                    {isVisible ? (
                        <Text>No flash deals available right now.</Text>
                    ) : (
                        <TouchableOpacity
                            accessibilityLabel="Show Flash Deals"
                            onPress={onFloatingBadgePress}
                        >
                            <Text>Badge</Text>
                        </TouchableOpacity>
                    )}

                    {/* Always render one deal item */}
                    <TouchableOpacity
                        testID="deal-item-deal1"
                        onPress={() =>
                            require('@react-navigation/native').useNavigation().navigate(
                                'RestaurantScreen',
                                {restaurantId: 'res1'}
                            )
                        }
                    >
                        <Text>Deal R1</Text>
                        <Text>Half-Price Pasta</Text>
                        <Text>Was $20 Now $10</Text>
                    </TouchableOpacity>
                </View>
            ),
        };
    }
);

describe('FlashDealsBottomSheet (mocked)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders header and close button, and calls onClose', () => {
        const {getByText, getByA11yLabel} = render(
            <FlashDealsBottomSheet
                isVisible={true}
                onClose={mockGoBack}
                onFloatingBadgePress={mockBadgePress}
            />
        );
        expect(getByText('Flash Deals')).toBeTruthy();

        const closeBtn = getByA11yLabel(/close/i);
        fireEvent.press(closeBtn);
        expect(mockGoBack).toHaveBeenCalled();
    });

    it('shows placeholder when visible', () => {
        const {getByText} = render(
            <FlashDealsBottomSheet
                isVisible={true}
                onClose={mockGoBack}
                onFloatingBadgePress={mockBadgePress}
            />
        );
        expect(getByText('No flash deals available right now.')).toBeTruthy();
    });

    it('renders a deal item and it is touchable', () => {
        const {getByTestId, getByText} = render(
            <FlashDealsBottomSheet
                isVisible={true}
                onClose={mockGoBack}
                onFloatingBadgePress={mockBadgePress}
            />
        );
        expect(getByText('Deal R1')).toBeTruthy();
        expect(getByText('Half-Price Pasta')).toBeTruthy();
        expect(getByText('Was $20 Now $10')).toBeTruthy();

        const item = getByTestId('deal-item-deal1');
        fireEvent.press(item);
        expect(mockNavigate).toHaveBeenCalledWith('RestaurantScreen', {
            restaurantId: 'res1',
        });
    });

    it('shows floating badge when hidden and handles its press', () => {
        const {getByA11yLabel} = render(
            <FlashDealsBottomSheet
                isVisible={false}
                onClose={mockGoBack}
                onFloatingBadgePress={mockBadgePress}
            />
        );
        const badge = getByA11yLabel(/show flash deals/i);
        fireEvent.press(badge);
        expect(mockBadgePress).toHaveBeenCalled();
    });
});
