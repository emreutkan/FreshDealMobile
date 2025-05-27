import React from 'react';
import {fireEvent} from '@testing-library/react-native';
import {ListingCard} from '@/src/features/RestaurantScreen/components/listingsCard';
import {addItemToCart} from '@/src/redux/thunks/cartThunks';
import {ScrollContext} from '@/src/features/RestaurantScreen/RestaurantDetails';
import {Animated} from 'react-native';
import {renderWithProviders} from '../testUtils';

// Mock modules
jest.mock('@/src/redux/thunks/cartThunks', () => ({
    addItemToCart: jest.fn(),
    updateCartItem: jest.fn(),
    removeItemFromCart: jest.fn(),
    resetCart: jest.fn(),
    fetchCart: jest.fn(),
}));

// Mock Alert from react-native
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    return {
        ...RN,
        Alert: {
            ...RN.Alert,
            alert: jest.fn(),
        },
    };
});

// Sample mock data
const mockListings = [
    {
        id: 1,
        restaurant_id: 101,
        title: 'Sample Listing 1',
        description: 'Description for sample listing 1',
        image_url: 'https://example.com/image1.jpg',
        count: 5,
        original_price: 15.99,
        pick_up_price: 10.99,
        delivery_price: 12.99,
        consume_within: 2,
        available_for_pickup: true,
        available_for_delivery: true,
        fresh_score: 85,
    },
    {
        id: 2,
        restaurant_id: 101,
        title: 'Sample Listing 2',
        description: 'Description for sample listing 2',
        image_url: 'https://example.com/image2.jpg',
        count: 3,
        original_price: 12.99,
        pick_up_price: 8.99,
        delivery_price: 10.99,
        consume_within: 3,
        available_for_pickup: true,
        available_for_delivery: false,
        fresh_score: 75,
    },
];

// Mock the animated value
const mockAnimatedValue = new Animated.Value(0);
const mockScrollContext = {
    scrollY: mockAnimatedValue,
    headerHeight: 200,
};

describe('ListingCard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with listing data', () => {
        const {getByText} = renderWithProviders(
            <ScrollContext.Provider value={mockScrollContext}>
                <ListingCard listingList={[mockListings[0]]} isPickup={true}/>
            </ScrollContext.Provider>
        );

        expect(getByText('Sample Listing 1')).toBeTruthy();
        expect(getByText('Description for sample listing 1')).toBeTruthy();
        expect(getByText('$10.99')).toBeTruthy();
    });

    test('addItemToCart is called when an item is added', () => {
        const {getByText} = renderWithProviders(
            <ScrollContext.Provider value={mockScrollContext}>
                <ListingCard listingList={[mockListings[0]]} isPickup={true}/>
            </ScrollContext.Provider>
        );

        // Find and click the "Add" button
        const addButton = getByText('Add');
        fireEvent.press(addButton);

        // Check if addItemToCart was called with the correct parameters
        expect(addItemToCart).toHaveBeenCalledWith({
            itemId: mockListings[0].id,
            quantity: 1,
            isDelivery: false,
        });
    });
});
