import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AchievementsScreen from '../../src/features/AchievementsScreen/AchievementsScreen';
import { fetchUserAchievementsThunk } from '../../src/redux/thunks/achievementThunks';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('../../src/redux/thunks/achievementThunks', () => ({
  fetchUserAchievementsThunk: () => ({ type: 'FETCH_ACHIEVEMENTS' })
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children }: any) => <View>{children}</View>
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: (props: any) => <icon {...props} /> };
});

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

const mockState = {
  user: {
    achievements: [
      { id: 1, name: 'A', description: 'D', achievement_type: 'STREAK', earned_at: '2024-01-01' },
      { id: 2, name: 'B', description: 'D2', achievement_type: 'STREAK', earned_at: null }
    ],
    loading: false
  }
};

(useSelector as jest.Mock).mockImplementation((selector) => selector(mockState));

const goBack = jest.fn();
(useNavigation as jest.Mock).mockReturnValue({ goBack });

const dispatch = jest.fn();
(useDispatch as jest.Mock).mockReturnValue(dispatch);

describe('AchievementsScreen', () => {
  beforeEach(() => {
    dispatch.mockClear();
    goBack.mockClear();
  });

  it('dispatches fetch thunk on mount', () => {
    render(<AchievementsScreen />);
    expect(dispatch).toHaveBeenCalledWith(fetchUserAchievementsThunk());
  });

  it('navigates back when back button pressed', () => {
    const { getByTestId } = render(<AchievementsScreen />);
    fireEvent.press(getByTestId('back-button'));
    expect(goBack).toHaveBeenCalled();
  });

  it('renders correct number of achievement cards', () => {
    const { getAllByTestId } = render(<AchievementsScreen />);
    expect(getAllByTestId(/achievement-card-/)).toHaveLength(2);
  });
});
