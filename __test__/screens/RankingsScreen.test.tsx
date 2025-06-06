import React from 'react';
import { render } from '@testing-library/react-native';
import RankingsScreen from '../../src/features/rankingsScreen/RankingsScreen';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getUserRankingsThunk } from '../../src/redux/thunks/userThunks';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

jest.mock('../../src/redux/thunks/userThunks', () => ({
  getUserRankingsThunk: () => ({ type: 'FETCH_RANKINGS' })
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Feather: (props: any) => <icon {...props} />, MaterialCommunityIcons: (props: any) => <icon {...props} /> };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}));

const goBack = jest.fn();
(useNavigation as jest.Mock).mockReturnValue({ goBack });
const dispatch = jest.fn();
(useDispatch as jest.Mock).mockReturnValue(dispatch);

const baseState = {
  user: {
    rankings: [],
    rankingsLoading: false,
    userId: 1
  }
};

describe('RankingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as jest.Mock).mockImplementation((sel) => sel(baseState));
  });

  it('dispatches fetch rankings on mount', () => {
    render(<RankingsScreen />);
    expect(dispatch).toHaveBeenCalledWith(getUserRankingsThunk());
  });

  it('shows loading indicator when loading', () => {
    baseState.user.rankingsLoading = true;
    const { getByText } = render(<RankingsScreen />);
    expect(getByText('Loading rankings...')).toBeTruthy();
  });

  it('shows empty state when no rankings', () => {
    baseState.user.rankingsLoading = false;
    baseState.user.rankings = [];
    const { getByText } = render(<RankingsScreen />);
    expect(getByText('No rankings available')).toBeTruthy();
  });

  it('renders list when rankings exist', () => {
    baseState.user.rankings = [{ user_id: 1, user_name: 'A', total_discount: 10, rank: 1 }];
    const { getByText } = render(<RankingsScreen />);
    expect(getByText('#1')).toBeTruthy();
    expect(getByText('A')).toBeTruthy();
  });
});
