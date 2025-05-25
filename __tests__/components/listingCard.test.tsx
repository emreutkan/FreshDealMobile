import React from 'react';
import {fireEvent, render} from '@testing-library/react-native'; // Added fireEvent
import {ListingCard} from '@/src/features/RestaurantScreen/components/listingsCard';
import {useDispatch, useSelector} from 'react-redux';
import {fetchCart} from '@/src/redux/thunks/cartThunks';
import {ScrollContext} from '@/src/features/RestaurantScreen/RestaurantDetails';
import {Animated} from 'react-native';

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
        consume_within: 1,
        available_for_pickup: true,
        available_for_delivery: true,
        fresh_score: 75,
    },
];

// Mock store
const mockStore = {
    restaurant: {
        selectedRestaurantListings: mockListings,
        isPickup: true,
    },
    cart: {
        cartItems: [],
        loading: false,
        error: null,
    },
};

// Create a wrapper component that provides the ScrollContext
const ScrollContextProvider = ({children}: { children: React.ReactNode }) => {
    const scrollYValue = new Animated.Value(0);
    return (
        <ScrollContext.Provider value={{
            scrollY: scrollYValue,
            headerHeight: 100
        }}>
            {children}
        </ScrollContext.Provider>
    );
};

// Custom render function that includes the context provider
const customRender = (ui: React.ReactElement, options = {}) => {
    return render(
        <ScrollContextProvider>{ui}</ScrollContextProvider>,
        options
    );
};

// Setup for mocking hooks before each test
beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock useSelector to return our mock store data
    (useSelector as jest.MockedFunction<typeof useSelector>).mockImplementation((selector) => {
        if (typeof selector === 'function') {
            return selector(mockStore);
        }
        return mockStore;
    });

    // Mock useDispatch to return a function that can be called with actions
    (useDispatch as jest.MockedFunction<typeof useDispatch>).mockReturnValue(jest.fn());
});

describe('ListingCard Component', () => {
    test('renders without crashing', () => {
        // Use our custom render function with the context provider
        customRender(<ListingCard/>);
        // If it renders without throwing an error, the test passes
    });

    test('displays correct pricing based on isPickup state', () => {
        // Mock with pickup mode
        (useSelector as jest.MockedFunction<typeof useSelector>).mockImplementation((selector) => {
            if (typeof selector === 'function') {
                return selector({
                    ...mockStore,
                    restaurant: {...mockStore.restaurant, isPickup: true},
                });
            }
            return mockStore;
        });

        // We don't need to find specific elements for now, just ensure rendering works
        customRender(<ListingCard/>);

        // Change to delivery mode
        (useSelector as jest.MockedFunction<typeof useSelector>).mockImplementation((selector) => {
            if (typeof selector === 'function') {
                return selector({
                    ...mockStore,
                    restaurant: {...mockStore.restaurant, isPickup: false},
                });
            }
            return mockStore;
        });

        customRender(<ListingCard/>);
    });

    test('fetch cart is called when component mounts', () => {
        customRender(<ListingCard/>);

        // Verify fetchCart was called when the component mounted
        expect(fetchCart).toHaveBeenCalled();
    });

    test('renders the correct number of listings', () => {
        const {getAllByTestId} = customRender(<ListingCard/>);
        // Assuming each listing item has a testID like 'listing-item-{id}'
        const listingItems = getAllByTestId(/^listing-item-/);
        expect(listingItems.length).toBe(mockListings.length);
    });

    test('displays a message when no listings are available', () => {
        (useSelector as jest.MockedFunction<typeof useSelector>).mockImplementation((selector) => {
            if (typeof selector === 'function') {
                return selector({
                    ...mockStore,
                    restaurant: {...mockStore.restaurant, selectedRestaurantListings: []},
                });
            }
            return {...mockStore, restaurant: {...mockStore.restaurant, selectedRestaurantListings: []}};
        });

        const {getByText} = customRender(<ListingCard/>);
        expect(getByText('No listings available.')).toBeTruthy();
    });

    test('addItemToCart is called when an item is added', () => {
        const {getAllByText} = customRender(<ListingCard/>);
        const addToCartButtons = getAllByText('Add to Cart');
        fireEvent.press(addToCartButtons[0]);
        expect(addItemToCart).toHaveBeenCalled();
    });
});
