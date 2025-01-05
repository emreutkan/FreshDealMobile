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
            const data = await loginUserAPI(payload);
            return data;
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
            role: string;
        },
        {rejectWithValue}
    ) => {
        try {
            const data = await registerUserAPI(userData);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Registration failed');
        }
    }
);

// Update username
export const updateUsername = createAsyncThunk<
    { username: string },
    { newUsername: string },
    { state: RootState; rejectValue: string }
>(
    'user/updateUsername',
    async ({newUsername}, {getState, rejectWithValue}) => {
        try {
            const token = getState().user.token;
            if (!token) throw new Error('No authentication token');
            const response = await updateUsernameAPI(newUsername, token);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update username');
        }
    }
);

// Update email
export const updateEmail = createAsyncThunk<
    { email: string },
    { oldEmail: string; newEmail: string },
    { state: RootState; rejectValue: string }
>(
    'user/updateEmail',
    async ({oldEmail, newEmail}, {getState, rejectWithValue}) => {
        try {
            const token = getState().user.token;
            if (!token) throw new Error('No authentication token');
            const response = await updateEmailAPI(oldEmail, newEmail, token);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update email');
        }
    }
);

// Update password
export const updatePassword = createAsyncThunk<
    { message: string },
    { oldPassword: string; newPassword: string },
    { state: RootState; rejectValue: string }
>(
    'user/updatePassword',
    async ({oldPassword, newPassword}, {getState, rejectWithValue}) => {
        try {
            const token = getState().user.token;
            if (!token) throw new Error('No authentication token');
            const response = await updatePasswordAPI(oldPassword, newPassword, token);
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
            const data = await getUserDataAPI(token);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user data');
        }
    }
);
