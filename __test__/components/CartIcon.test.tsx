import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CartIcon from '../../src/features/RestaurantScreen/components/CartIcon';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (props: any) => <icon testID="icon" {...props} /> };
});

const navigate = jest.fn();
(useNavigation as jest.Mock).mockReturnValue({ navigate });

describe('CartIcon', () => {
  it('navigates to cart on press', () => {
    const { getByTestId } = render(<CartIcon />);
    fireEvent.press(getByTestId('icon').parent);
    expect(navigate).toHaveBeenCalledWith('Cart');
  });
});
