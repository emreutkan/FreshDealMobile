import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DebugMenuScreen from '../../src/features/debugMenu/DebugMenuScreen';
import { useDispatch, useSelector } from 'react-redux';
import { getRecentRestaurantsThunk } from '../../src/redux/thunks/restaurantThunks';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../src/redux/thunks/restaurantThunks', () => ({
  getRecentRestaurantsThunk: () => ({ type: 'RECENT' }),
}));

jest.mock('../../src/services/tokenService', () => ({
  tokenService: { getToken: jest.fn(() => Promise.resolve('x')) },
}));

jest.mock('@expo/vector-icons', () => { const React = require('react'); return { Ionicons: (p:any) => <icon {...p} /> }; });

jest.mock('react-native-safe-area-context', () => ({ SafeAreaView: ({children}:any) => <>{children}</>, useSafeAreaInsets: () => ({top:0,bottom:0,left:0,right:0}) }));

const dispatch = jest.fn();
(useDispatch as jest.Mock).mockReturnValue(dispatch);
(useSelector as jest.Mock).mockImplementation((sel) => sel({ restaurant:{ selectedRestaurant:{} }, user:{}, cart:{}, address:{}, search:{}, purchase:{} }));

describe('DebugMenuScreen', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('toggles redux state view', () => {
    const { getByText, queryByText } = render(<DebugMenuScreen />);
    expect(queryByText('User State')).toBeNull();
    fireEvent.press(getByText('Inspect Redux State'));
    expect(getByText('User State')).toBeTruthy();
  });

  it('dispatches api action on press', async () => {
    const { getByText } = render(<DebugMenuScreen />);
    await fireEvent.press(getByText('Test Recent Restaurants'));
    expect(dispatch).toHaveBeenCalledWith(getRecentRestaurantsThunk());
  });
});
