import React from 'react';
import { render } from '@testing-library/react-native';
import CartScreen from '../../src/features/CartScreen/CartScreen';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from '../../src/redux/thunks/cartThunks';
import { useNavigation } from '@react-navigation/native';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() })
}));

jest.mock('../../src/redux/thunks/cartThunks', () => ({
  fetchCart: () => ({ type: 'FETCH_CART' })
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (props: any) => <icon {...props} />, MaterialIcons: (props: any) => <icon {...props} /> };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}));

jest.mock('../../src/features/homeScreen/components/goBack', () => ({
  GoBackIcon: () => <></>
}));

jest.mock('../../src/features/RestaurantScreen/components/listingsCard', () => () => <></>);

const dispatch = jest.fn();
(useDispatch as jest.Mock).mockReturnValue(dispatch);

const baseState = {
  cart: { cartItems: [] as any[] },
  restaurant: {
    restaurantsProximity: [] as any[],
    selectedRestaurantListings: [] as any[],
    selectedRestaurant: { pickup: true, delivery: true },
    isPickup: true
  }
};

describe('CartScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as jest.Mock).mockImplementation((sel) => sel(baseState));
  });

  it('dispatches fetchCart on mount', () => {
    render(<CartScreen />);
    expect(dispatch).toHaveBeenCalledWith(fetchCart());
  });

  it('shows empty cart text when no items', () => {
    const { getByText } = render(<CartScreen />);
    expect(getByText('Your cart is empty')).toBeTruthy();
  });

  it('shows checkout button when items exist', () => {
    baseState.cart.cartItems = [{ restaurant_id: 1, listing_id: 1, count: 1 }];
    baseState.restaurant.restaurantsProximity = [{ id: 1, restaurantName: 'A' }];
    baseState.restaurant.selectedRestaurantListings = [{ id: 1, pick_up_price: 10, delivery_price: 12 }];
    const { getByText } = render(<CartScreen />);
    expect(getByText('Proceed to Checkout')).toBeTruthy();
  });
});
