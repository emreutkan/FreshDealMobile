import React from 'react';
import { render } from '@testing-library/react-native';
import FavoritesScreen from '../../src/features/favoritesScreen/FavoritesScreen';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn()
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    MaterialIcons: (props: any) => <icon {...props} />,
  };
});

jest.mock('../../src/features/homeScreen/components/goBack', () => ({
  GoBackIcon: () => <></>
}));

jest.mock('../../src/features/homeScreen/components/RestaurantCard', () => {
  return () => <></>;
});

const mockState = {
  restaurant: {
    favoriteRestaurantsIDs: [] as number[],
    restaurantsProximity: [] as any[],
    restaurantsProximityLoading: false,
  }
};

(useSafeAreaInsets as jest.Mock).mockReturnValue({ top: 0, bottom: 0, left: 0, right: 0 });

describe('FavoritesScreen', () => {
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((selector) => selector(mockState));
  });

  it('shows loading indicator when loading', () => {
    mockState.restaurant.restaurantsProximityLoading = true;
    const { getByText } = render(<FavoritesScreen />);
    expect(getByText('Loading your favorites...')).toBeTruthy();
  });

  it('shows empty state text when no favorites', () => {
    mockState.restaurant.restaurantsProximityLoading = false;
    mockState.restaurant.favoriteRestaurantsIDs = [];
    const { getByText } = render(<FavoritesScreen />);
    expect(getByText('No Favorites Yet')).toBeTruthy();
  });

  it('shows favorite restaurants list when favorites exist', () => {
    mockState.restaurant.favoriteRestaurantsIDs = [1];
    mockState.restaurant.restaurantsProximity = [{ id: 1, restaurantName: 'Test', workingDays: [], listings: 0, workingHoursStart: '', workingHoursEnd: '', restaurantDescription: '', rating: 0, ratingCount: 0 }];
    const { getByText } = render(<FavoritesScreen />);
    expect(getByText('Favorite Restaurants')).toBeTruthy();
  });
});
