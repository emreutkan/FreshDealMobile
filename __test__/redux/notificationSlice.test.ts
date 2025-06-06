import notificationReducer, { setPushToken, setIsRegistered } from '../../src/redux/slices/notificationSlice';

describe('notificationSlice reducers', () => {
  const initialState = { pushToken: undefined, isRegistered: false, lastNotification: undefined };

  it('stores push token', () => {
    const state = notificationReducer(initialState, setPushToken('token123'));
    expect(state.pushToken).toBe('token123');
  });

  it('updates registration flag', () => {
    const state = notificationReducer(initialState, setIsRegistered(true));
    expect(state.isRegistered).toBe(true);
  });
});
