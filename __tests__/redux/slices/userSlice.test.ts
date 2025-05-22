import userReducer, {logout, setEmail, setName, setPhoneNumber} from '../../../src/redux/slices/userSlice';
import {loginUserThunk} from '../../../src/redux/thunks/userThunks';

describe('User Slice', () => {
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

    it('should handle initial state', () => {
        expect(userReducer(undefined, {type: 'unknown'})).toEqual(initialState);
    });

    it('should handle setEmail', () => {
        const actual = userReducer(initialState, setEmail('test@example.com'));
        expect(actual.email).toEqual('test@example.com');
    });

    it('should handle setName', () => {
        const actual = userReducer(initialState, setName('John Doe'));
        expect(actual.name_surname).toEqual('John Doe');
    });

    it('should handle setPhoneNumber', () => {
        const actual = userReducer(initialState, setPhoneNumber('5551234567'));
        expect(actual.phoneNumber).toEqual('5551234567');
    });

    it('should handle logout', () => {
        const filledState = {
            ...initialState,
            email: 'test@example.com',
            token: 'some-token',
            isAuthenticated: true
        };
        const actual = userReducer(filledState, logout());
        expect(actual).toEqual(initialState);
    });

    it('should set loading to true when loginUserThunk is pending', () => {
        const action = {type: loginUserThunk.pending.type};
        const state = userReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
    });

    it('should set user data when loginUserThunk is fulfilled', () => {
        const action = {
            type: loginUserThunk.fulfilled.type,
            payload: {token: 'test-token'}
        };
        const state = userReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.token).toBe('test-token');
        expect(state.isAuthenticated).toBe(true);
    });

    it('should set error when loginUserThunk is rejected', () => {
        const action = {
            type: loginUserThunk.rejected.type,
            error: {message: 'Authentication failed'}
        };
        const state = userReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Authentication failed');
    });
});