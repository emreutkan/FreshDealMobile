import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Search from '../../src/features/search/Search';
jest.mock('expo-secure-store', () => ({}));
jest.mock('../../src/services/tokenService', () => ({}));
jest.mock('../../src/redux/thunks/restaurantThunks', () => ({
  getRestaurantsByProximity: () => ({ type: 'MOCK' })
}));
jest.mock('../../src/redux/thunks/searchThunks', () => ({
  SearchforRestaurantsThunk: () => ({ type: 'MOCK' })
}));
jest.mock('../../src/hooks/handleRestaurantPress', () => ({
  useHandleRestaurantPress: () => jest.fn()
}));
jest.mock('../../src/redux/thunks/userThunks', () => ({
  addFavoriteThunk: () => ({ type: 'MOCK' }),
  removeFavoriteThunk: () => ({ type: 'MOCK' })
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector: any) => selector({
    search: { searchResults: { results: [{ id: 1 }] } },
    restaurant: { restaurantsProximity: [
        { id: 1, workingDays: ['Monday'], listings: 1, workingHoursStart: '09:00', workingHoursEnd: '18:00', restaurantName: 'A', restaurantDescription: '', rating: 4, ratingCount: 0 },
        { id: 2, workingDays: ['Monday'], listings: 1, workingHoursStart: '09:00', workingHoursEnd: '18:00', restaurantName: 'B', restaurantDescription: '', rating: 4, ratingCount: 0 }
      ], favoriteRestaurantsIDs: [] },
    address: { selectedAddressId: '1', addresses: [{ id: '1', latitude: 0, longitude: 0 }] },
    user: {}
  })
}));

jest.mock('react-native-vector-icons/Ionicons', () => {
  const React = require('react');
  return (props: any) => <icon {...props} />;
});
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: (props: any) => <icon {...props} />,
    MaterialCommunityIcons: (props: any) => <icon {...props} />,
    MaterialIcons: (props: any) => <icon {...props} />,
  };
});

describe('Search Screen', () => {
  it('updates search text and shows result count', () => {
    const { getByPlaceholderText, getByText } = render(<Search />);
    const input = getByPlaceholderText('Search for restaurants...');
    fireEvent.changeText(input, 'pizza');
    expect(getByText('1 results found')).toBeTruthy();
  });
});
