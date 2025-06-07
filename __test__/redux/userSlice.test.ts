import userReducer, { setSelectedCode, setEmail, setPhoneNumber, setToken, logout } from '../../src/redux/slices/userSlice';

const initialState = {
  email: '',
  name_surname: '',
  phoneNumber: '',
  selectedCode: '+90',
  password: '',
  passwordLogin: false,
  verificationCode: '',
  step: 'send_code',
  login_type: 'email',
  token: null,
  loading: false,
  error: null,
  role: 'customer',
  email_verified: false,
  isInitialized: false,
  shouldNavigateToLanding: true,
  isAuthenticated: false,
  foodSaved: 0,
  moneySaved: 0,
  achievements: [],
  achievementsLoading: false,
  totalDiscountEarned: 0,
  userId: 0,
  rank: 0,
  totalDiscount: 0,
  rankings: [],
  rankLoading: false,
  rankingsLoading: false,
};

describe('userSlice reducers', () => {
  it('sets selected code', () => {
    const state = userReducer(initialState, setSelectedCode('+1'));
    expect(state.selectedCode).toBe('+1');
  });

  it('sets email and clears password if both empty', () => {
    const state = userReducer(initialState, setEmail('test@example.com'));
    expect(state.email).toBe('test@example.com');
  });

  it('sanitizes phone number', () => {
    const state = userReducer(initialState, setPhoneNumber('(555)123-4567'));
    expect(state.phoneNumber).toBe('5551234567');
  });

  it('sets token and authenticated', () => {
    const state = userReducer(initialState, setToken('abc'));
    expect(state.token).toBe('abc');
    expect(state.isAuthenticated).toBe(true);
  });

  it('resets state on logout', () => {
    const logged = { ...initialState, token: 'abc', isAuthenticated: true };
    const state = userReducer(logged, logout());
    expect(state).toEqual(initialState);
  });
});
