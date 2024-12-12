// store/thunks/userThunks.ts
import {createAsyncThunk} from '@reduxjs/toolkit';
import {loginUserAPI} from '@/api/userAPI';

// Thunk for login with all possible fields
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
            return data; // Return API response
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);
