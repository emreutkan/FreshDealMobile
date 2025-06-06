import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../../src/features/homeScreen/screens/Home';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((cb) => cb()),
  useNavigation: () => ({ navigate: jest.fn() }),
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: any) => <>{children}</>,
    Screen: ({ children }: any) => <>{children}</>
  })
}));

jest.mock('@gorhom/bottom-sheet', () => ({
  BottomSheetModalProvider: ({ children }: any) => <>{children}</>
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (props: any) => <icon {...props} /> };
});

jest.mock('../../src/features/AddressSelectionScreen/addressSelectionScreen', () => () => <>{'Address Selector'}</>);
jest.mock('../../src/features/homeScreen/screens/HomeCardView', () => () => <>{'Card View'}</>);
jest.mock('../../src/features/homeScreen/screens/HomeMapView', () => () => <>{'Map View'}</>);
jest.mock('../../src/features/accountScreen/accountScreen', () => () => <>{'Account'}</>);
jest.mock('../../src/features/search/Search', () => () => <>{'Search'}</>);

const dispatch = jest.fn();
(useDispatch as jest.Mock).mockReturnValue(dispatch);

const baseState = {
  address: { addresses: [], selectedAddressId: null },
  restaurant: { restaurantsProximity: [] }
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as jest.Mock).mockImplementation((sel) => sel(baseState));
  });

  it('renders address selector when no addresses', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Address Selector')).toBeTruthy();
  });

  it('renders home views when address exists', () => {
    baseState.address.addresses = [{ id: '1' } as any];
    baseState.address.selectedAddressId = '1';
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Card View')).toBeTruthy();
  });
});
