import React from 'react';
import { render } from '@testing-library/react-native';
import Orders from '../../src/features/OrdersScreen/Orders';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchActiveOrdersAsync } from '../../src/redux/thunks/purchaseThunks';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useRoute: () => ({ params: { status: 'active' } })
}));

jest.mock('../../src/redux/thunks/purchaseThunks', () => ({
  fetchActiveOrdersAsync: () => ({ type: 'FETCH_ACTIVE' }),
  fetchPreviousOrdersAsync: () => ({ type: 'FETCH_PREV' })
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (props: any) => <icon {...props} /> };
});

jest.mock('../../src/features/homeScreen/components/goBack', () => ({
  GoBackIcon: () => <></>
}));

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return { LinearGradient: ({ children }: any) => <View>{children}</View> };
});

const dispatch = jest.fn();
(useDispatch as jest.Mock).mockReturnValue(dispatch);

const baseState = {
  purchase: {
    activeOrders: [] as any[],
    previousOrders: [] as any[],
    loadingActiveOrders: false,
    loadingPreviousOrders: false,
    previousOrdersPagination: { hasNext: false }
  }
};

describe('OrdersScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as jest.Mock).mockImplementation((sel) => sel(baseState));
  });

  it('dispatches fetchActiveOrders on mount', () => {
    render(<Orders />);
    expect(dispatch).toHaveBeenCalledWith(fetchActiveOrdersAsync());
  });

  it('shows empty state when no orders', () => {
    const { getByText } = render(<Orders />);
    expect(getByText('No Active Orders')).toBeTruthy();
  });
});
