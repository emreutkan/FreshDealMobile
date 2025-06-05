import configureMockStore from 'redux-mock-store';
import { tokenMiddleware } from '@/src/middleware/tokenMiddleware';
import { tokenService } from '@/src/services/tokenService';

const mockStore = configureMockStore([tokenMiddleware]);

describe('tokenMiddleware', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('dispatches logout when token missing', () => {
    jest.spyOn(tokenService, 'getToken').mockReturnValue(null as any);
    const store = mockStore({});
    store.dispatch({ type: 'some/protectedAction' });
    expect(store.getActions()).toContainEqual({ type: 'user/logout' });
  });

  test('passes action when token exists', () => {
    jest.spyOn(tokenService, 'getToken').mockReturnValue('token' as any);
    const store = mockStore({});
    const action = { type: 'another/protectedAction' };
    store.dispatch(action);
    expect(store.getActions()).toContainEqual(action);
  });
});
