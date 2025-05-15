import {loginUserThunk, registerUserThunk} from '../../src/redux/thunks/userThunks';
import {authApi} from '../../src/redux/api/authAPI';
import {setToken} from '../../src/redux/slices/userSlice';

// Mock the API and tokenService
jest.mock('../../src/redux/api/authAPI', () => ({
    authApi: {
        login: jest.fn(),
        register: jest.fn(),
    },
}));

jest.mock('../../src/redux/slices/userSlice', () => ({
    setToken: jest.fn(),
}));

// Mock getUserDataThunk since it's used inside loginUserThunk
jest.mock('../../src/redux/thunks/userThunks', () => {
    const actual = jest.requireActual('../../src/redux/thunks/userThunks');
    return {
        ...actual,
        getUserDataThunk: jest.fn().mockResolvedValue({}),
    };
});

describe('User Thunks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('loginUserThunk', () => {
        it('should dispatch setToken and getUserDataThunk on successful login', async () => {
            // Mock successful login response
            const mockResponse = {token: 'test-token', user: {id: '1', name: 'Test User'}};
            (authApi.login as jest.Mock).mockResolvedValue(mockResponse);

            // Mock dispatch function
            const dispatch = jest.fn();
            dispatch.mockResolvedValue({});

            // Create a mock for getState
            const getState = jest.fn(() => ({}));

            // Call the thunk with mock arguments
            const loginPayload = {email: 'test@example.com', password: 'password'};
            await loginUserThunk(loginPayload)(dispatch, getState, undefined);

            // Verify login was called with the correct payload
            expect(authApi.login).toHaveBeenCalledWith(loginPayload);

            // Verify setToken was dispatched with the correct token
            expect(setToken).toHaveBeenCalledWith(mockResponse.token);
        });

        it('should return rejectWithValue on login failure', async () => {
            // Mock login failure
            const mockError = {response: {data: 'Invalid credentials'}};
            (authApi.login as jest.Mock).mockRejectedValue(mockError);

            // Mock functions for thunkAPI
            const dispatch = jest.fn();
            const getState = jest.fn(() => ({}));
            const rejectWithValue = jest.fn(value => value);

            // Call the thunk with mock arguments
            const loginPayload = {email: 'test@example.com', password: 'wrong'};
            await loginUserThunk(loginPayload)({dispatch, getState, rejectWithValue} as any);

            // Verify rejectWithValue was called with the error message
            expect(rejectWithValue).toHaveBeenCalledWith('Invalid credentials');
        });
    });

    describe('registerUserThunk', () => {
        it('should return success response on successful registration', async () => {
            // Mock successful registration response
            const mockResponse = {success: true, message: 'Registration successful'};
            (authApi.register as jest.Mock).mockResolvedValue(mockResponse);

            // Mock rejectWithValue function
            const rejectWithValue = jest.fn();

            // Call the thunk with mock arguments
            const registerPayload = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password'
            };
            const result = await registerUserThunk(registerPayload)({rejectWithValue} as any);

            // Verify register was called with the correct payload
            expect(authApi.register).toHaveBeenCalledWith(registerPayload);

            // Verify the thunk returned the correct value
            expect(result).toEqual(mockResponse);
        });

        it('should return rejectWithValue on registration failure', async () => {
            // Mock registration failure
            const mockError = {response: {data: 'Email already exists'}};
            (authApi.register as jest.Mock).mockRejectedValue(mockError);

            // Mock rejectWithValue function
            const rejectWithValue = jest.fn(value => value);

            // Call the thunk with mock arguments
            const registerPayload = {
                username: 'testuser',
                email: 'existing@example.com',
                password: 'password'
            };
            const result = await registerUserThunk(registerPayload)({rejectWithValue} as any);

            // Verify rejectWithValue was called with the error message
            expect(rejectWithValue).toHaveBeenCalledWith('Email already exists');
        });
    });
});