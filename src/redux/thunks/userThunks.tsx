import {createAsyncThunk} from '@reduxjs/toolkit';

import {RootState} from "@/src/redux/store";
import {UserDataResponse} from "@/src/redux/slices/userSlice";
import {loginUserAPI, registerUserAPI} from "@/src/redux/api/authAPI";
import {
    addToFavoritesAPI,
    getFavoritesAPI,
    getUserDataAPI,
    removeFromFavoritesAPI,
    updateEmailAPI,
    updatePasswordAPI,
    updateUsernameAPI
} from "@/src/redux/api/userAPI"; // adjust the path as necessary


// Login user
export const loginUserThunk = createAsyncThunk(
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
        {dispatch, rejectWithValue}
    ) => {
        try {
            const response = await loginUserAPI(payload);
            const token = response.token;
            dispatch(getUserDataThunk({token}));
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

// Register user
export const registerUserThunk = createAsyncThunk(
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
            const response = await updateUsernameAPI(newUsername, token);

            dispatch(getUserDataThunk({token}));

            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update username');
        }
    }
);
// -------------------------------------------------------------------
// 4) Update email
// -------------------------------------------------------------------
export const updateEmailThunk = createAsyncThunk<
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
            const response = await updateEmailAPI(oldEmail, newEmail, token);

            dispatch(getUserDataThunk({token}));

            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update email');
        }
    }
);

// -------------------------------------------------------------------
// 5) Update password
// -------------------------------------------------------------------
export const updatePasswordThunk = createAsyncThunk<
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
            const response = await updatePasswordAPI(oldPassword, newPassword, token);

            dispatch(getUserDataThunk({token}));

            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update password');
        }
    }
);
// Get user data
export const getUserDataThunk = createAsyncThunk<
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


export const addFavoriteThunk = createAsyncThunk<
    { message: string },
    { restaurantId: string },
    { state: RootState; rejectValue: string }
>(
    'favorites/addFavorite',
    async ({restaurantId}, {dispatch, getState, rejectWithValue}) => {
        const token = getState().user.token;
        if (!token) {
            return rejectWithValue('Authentication token is missing.');
        }

        try {
            const response = await addToFavoritesAPI(restaurantId, token);
            await dispatch(getFavoritesThunk());

            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to add favorite'
            );
        }
    }
);


export const removeFavoriteThunk = createAsyncThunk<
    { message: string },
    { restaurantId: number },
    { state: RootState; rejectValue: string }
>(
    'favorites/removeFavorite',
    async ({restaurantId}, {dispatch, getState, rejectWithValue}) => {
        const token = getState().user.token;
        if (!token) {
            return rejectWithValue('Authentication token is missing.');
        }

        try {
            const response = await removeFromFavoritesAPI(restaurantId, token);
            await dispatch(getFavoritesThunk());
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to remove favorite'
            );
        }
    }
);


export const getFavoritesThunk = createAsyncThunk<
    string[],
    void,
    { state: RootState; rejectValue: string }
>(
    'favorites/getFavorites',
    async (_, {getState, rejectWithValue}) => {
        const token = getState().user.token;
        if (!token) {
            return rejectWithValue('Authentication token is missing.');
        }

        try {
            return await getFavoritesAPI(token);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch favorites'
            );
        }
    }
);
