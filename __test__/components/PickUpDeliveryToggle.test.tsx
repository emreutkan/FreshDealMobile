import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PickupDeliveryToggle from '../../src/features/RestaurantScreen/components/PickUpDeliveryToggle';
import { useDispatch, useSelector } from 'react-redux';
import { setDeliveryMethod } from '../../src/redux/slices/restaurantSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (props: any) => <icon {...props} /> };
});

const dispatch = jest.fn();
(useDispatch as jest.Mock).mockReturnValue(dispatch);

const baseState = {
  restaurant: { selectedRestaurant: { pickup: true, delivery: true }, isPickup: true }
};

(useSelector as jest.Mock).mockImplementation((selector) => selector(baseState));

describe('PickupDeliveryToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    baseState.restaurant.selectedRestaurant = { pickup: true, delivery: true };
    baseState.restaurant.isPickup = true;
  });

  it('renders dual buttons and toggles method', () => {
    const { getByText } = render(<PickupDeliveryToggle layout="row" />);
    fireEvent.press(getByText('Delivery'));
    expect(dispatch).toHaveBeenCalledWith(setDeliveryMethod(false));
    fireEvent.press(getByText('Pick Up'));
    expect(dispatch).toHaveBeenCalledWith(setDeliveryMethod(true));
  });

  it('renders single pick up button when only pickup', () => {
    baseState.restaurant.selectedRestaurant = { pickup: true, delivery: false };
    const { getByText, queryByText } = render(<PickupDeliveryToggle />);
    expect(getByText('Pick Up')).toBeTruthy();
    expect(queryByText('Delivery')).toBeNull();
  });

  it('returns null when no methods', () => {
    baseState.restaurant.selectedRestaurant = { pickup: false, delivery: false };
    const { toJSON } = render(<PickupDeliveryToggle />);
    expect(toJSON()).toBeNull();
  });
});
