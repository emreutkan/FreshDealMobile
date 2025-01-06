import {createAsyncThunk} from '@reduxjs/toolkit';
import {
    getUserDataAPI,
    loginUserAPI,
    registerUserAPI,
    updateEmailAPI,
    updatePasswordAPI,
    updateUsernameAPI,
} from "@/api/userAPI";
import {RootState} from "@/store/store";
import {UserDataResponse} from "@/store/slices/userSlice";

// Login user
export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (
        payload: {
            email?: string;
            phone_number?: string;
            password?: string;
            verification_code?: string;
            step?: "send_code" | "verify_code" | "skip_verification";
            login_type?: "email" | "phone_number";
            password_login?: boolean;
        },
        {rejectWithValue}
    ) => {
        try {
            return await loginUserAPI(payload);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

// Register user
export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (
        userData: {
            name_surname: string;
            email?: string;
            phone_number?: string;
            password: string;
            role: "customer";
        },
        {rejectWithValue}
    ) => {
        try {
            return await registerUserAPI(userData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Registration failed');
        }
    }
);
// -------------------------------------------------------------------
// 3) Update username
// -------------------------------------------------------------------
export const updateUsername = createAsyncThunk<
    { username: string },
    { newUsername: string },
    { state: RootState; rejectValue: string; dispatch: any }  // <== Notice "dispatch" here
>(
    'user/updateUsername',
    async ({newUsername}, {dispatch, getState, rejectWithValue}) => {
        try {
            const token = getState().user.token;
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }
            // 3.a) Update the username via API
            const response = await updateUsernameAPI(newUsername, token);

            // 3.b) Immediately fetch updated user info
            dispatch(getUserData({token}));

            // 3.c) Return the response from updateUsernameAPI
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update username');
        }
    }
);
// -------------------------------------------------------------------
// 4) Update email
// -------------------------------------------------------------------
export const updateEmail = createAsyncThunk<
    { email: string },
    { oldEmail: string; newEmail: string },
    { state: RootState; rejectValue: string; dispatch: any } // <== Notice "dispatch" here
>(
    'user/updateEmail',
    async ({oldEmail, newEmail}, {dispatch, getState, rejectWithValue}) => {
        try {
            const token = getState().user.token;
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }
            // 4.a) Update the email via API
            const response = await updateEmailAPI(oldEmail, newEmail, token);

            // 4.b) Immediately fetch updated user info
            dispatch(getUserData({token}));

            // 4.c) Return the response from updateEmailAPI
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update email');
        }
    }
);

// -------------------------------------------------------------------
// 5) Update password
// -------------------------------------------------------------------
export const updatePassword = createAsyncThunk<
    { message: string },
    { oldPassword: string; newPassword: string },
    { state: RootState; rejectValue: string; dispatch: any } // <== Notice "dispatch" here
>(
    'user/updatePassword',
    async ({oldPassword, newPassword}, {dispatch, getState, rejectWithValue}) => {
        try {
            const token = getState().user.token;
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }
            // 5.a) Update the password via API
            const response = await updatePasswordAPI(oldPassword, newPassword, token);

            // 5.b) Immediately fetch updated user info
            dispatch(getUserData({token}));

            // 5.c) Return the response from updatePasswordAPI
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update password');
        }
    }
);
// Get user data
export const getUserData = createAsyncThunk<
    UserDataResponse,
    { token: string },
    { rejectValue: string }
>(
    'user/getUserData',
    async ({token}, {rejectWithValue}) => {
        try {
            return await getUserDataAPI(token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user data');
        }
    }
);
