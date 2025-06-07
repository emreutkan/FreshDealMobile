import configureMockStore from 'redux-mock-store';
import { restaurantMiddleware } from '@/src/middleware/restaurantMiddleware';
import { setSelectedRestaurant } from '@/src/redux/slices/restaurantSlice';
import { getListingsThunk } from '@/src/redux/thunks/restaurantThunks';

jest.mock('@/src/redux/thunks/restaurantThunks', () => ({
  getListingsThunk: jest.fn((params) => ({ type: 'getListingsThunk', payload: params }))
}));

const mockStore = configureMockStore([restaurantMiddleware]);

describe('restaurantMiddleware', () => {
  test('dispatches listings thunk when selecting restaurant', () => {
    const store = mockStore({});
    store.dispatch(setSelectedRestaurant({ id: 7 } as any));
    expect(store.getActions()).toContainEqual(expect.objectContaining({ type: 'getListingsThunk' }));
  });
});
