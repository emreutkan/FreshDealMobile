import React from 'react';
import { render } from '@testing-library/react-native';
import AccountScreen from '../../src/features/accountScreen/accountScreen';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAchievementsThunk } from '../../src/redux/thunks/achievementThunks';
import { useNavigation } from '@react-navigation/native';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../src/redux/thunks/achievementThunks', () => ({
  fetchUserAchievementsThunk: () => ({ type: 'FETCH_ACH' }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (p: any) => <icon {...p} /> };
});

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return { LinearGradient: ({ children }: any) => <View>{children}</View> };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const dispatch = jest.fn();
(useDispatch as jest.Mock).mockReturnValue(dispatch);
(useSelector as jest.Mock).mockImplementation((sel) => sel({
  user: { name_surname: '', email: '', phoneNumber: '', loading: false, achievements: [] }
}));

describe('AccountScreen', () => {
  it('dispatches achievements fetch on mount', () => {
    render(<AccountScreen />);
    expect(dispatch).toHaveBeenCalledWith(fetchUserAchievementsThunk());
  });
});
