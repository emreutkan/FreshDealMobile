// userThunks.ts

import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "@/src/types/store";
import {tokenService} from "@/src/services/tokenService";
import {userApi} from "@/src/redux/api/userAPI";
import {authApi} from "@/src/redux/api/authAPI";
import {LoginResponse, RegisterResponse} from "@/src/types/api/auth/responses";
import {LoginPayload, RegisterPayload} from "@/src/types/api/auth/requests";
import {
    AddFavoritePayload,
    RemoveFavoritePayload,
    UpdateEmailPayload,
    UpdatePasswordPayload,
    UpdateUsernamePayload
} from "@/src/types/api/user/requests";
import {
    AddFavoriteResponse,
    GetFavoritesResponse,
    RemoveFavoriteResponse,
    UpdateEmailResponse,
    UpdatePasswordResponse,
    UpdateUsernameResponse
} from "@/src/types/api/user/responses";
import {setToken, UserDataResponse} from "@/src/redux/slices/userSlice"; // Example import, adjust as needed
import {logout as userLogout} from "../slices/userSlice";

// Login
export const loginUserThunk = createAsyncThunk<
    LoginResponse,
    LoginPayload,
    { state: RootState; rejectValue: string }
>(
    "user/loginUser",
    async (payload, {dispatch, getState, rejectWithValue}) => {
        try {
            const response = await authApi.login(payload);
            console.log(response)
            // Transform the response to match LoginResponse.
            // For example, if your ApiResponse is structured as:
            // { data: { token: string }, message: string, status: number }

            if (response.token) {
                dispatch(setToken(response.token));
                await dispatch(getUserDataThunk({token: response.token}));
            }

            console.log(response)
            return response;
        } catch (error: any) {
            console.log(error)
            return rejectWithValue(error.response?.data || "Login failed");
        }
    }
);


// Registration
export const registerUserThunk = createAsyncThunk<
    RegisterResponse,
    RegisterPayload,
    { rejectValue: string }
>(
    "user/registerUser",
    async (userData, {rejectWithValue}) => {
        try {
            return await authApi.register(userData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Registration failed");
        }
    }
);

// Update username
export const updateUsernameThunk = createAsyncThunk<
    UpdateUsernameResponse,
    UpdateUsernamePayload,
    { state: RootState; rejectValue: string }
>(
    "user/updateUsername",
    async ({username}, {dispatch, getState, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            const response = await userApi.updateUsername(username, token);
            await dispatch(getUserDataThunk({token}));
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update username");
        }
    }
);

// Update email
export const updateEmailThunk = createAsyncThunk<
    UpdateEmailResponse,
    UpdateEmailPayload,
    { state: RootState; rejectValue: string }
>(
    "user/updateEmail",
    async ({old_email, new_email}, {dispatch, getState, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            const response = await userApi.updateEmail(old_email, new_email, token);
            await dispatch(getUserDataThunk({token}));
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update email");
        }
    }
);

// Update password
export const updatePasswordThunk = createAsyncThunk<
    UpdatePasswordResponse,
    UpdatePasswordPayload,
    { state: RootState; rejectValue: string }
>(
    "user/updatePassword",
    async ({old_password, new_password}, {dispatch, getState, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            const response = await userApi.updatePassword(old_password, new_password, token);
            await dispatch(getUserDataThunk({token}));
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update password");
        }
    }
);

// Get user data
export const getUserDataThunk = createAsyncThunk<
    UserDataResponse,
    { token: string },
    { rejectValue: string }
>(
    "user/getUserData",
    async ({token}, {rejectWithValue}) => {
        try {
            return await userApi.getUserData(token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to fetch user data");
        }
    }
);

// Add to favorites
export const addFavoriteThunk = createAsyncThunk<
    AddFavoriteResponse,
    AddFavoritePayload,
    { state: RootState; rejectValue: string }
>(
    "favorites/addFavorite",
    async ({restaurant_id}, {dispatch, getState, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            const response = await userApi.addToFavorites(restaurant_id, token);
            await dispatch(getFavoritesThunk()); // Refresh favorites
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to add favorite");
        }
    }
);

// Remove from favorites
export const removeFavoriteThunk = createAsyncThunk<
    RemoveFavoriteResponse,
    RemoveFavoritePayload,
    { state: RootState; rejectValue: string }
>(
    "favorites/removeFavorite",
    async ({restaurant_id}, {dispatch, getState, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            const response = await userApi.removeFromFavorites(restaurant_id, token);
            await dispatch(getFavoritesThunk()); // Refresh favorites
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to remove favorite");
        }
    }
);

export const getFavoritesThunk = createAsyncThunk<
    GetFavoritesResponse,
    void,
    { state: RootState; rejectValue: string }
>(
    "favorites/getFavorites",
    async (_, {getState, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            const response = await userApi.getFavorites(token);
            // Ensure that we wrap the favorites array inside an object with a favorites property.
            return {favorites: response.favorites};
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch favorites"
            );
        }
    }
);

export const logoutThunk = createAsyncThunk(
    "user/logout",
    async (_, {dispatch, getState}) => {
        // Dispatch logout action for each slice that needs to be reset
        dispatch(userLogout());
        // Add other slice logout actions here

        // Clear any stored tokens or session data
        localStorage.removeItem('token'); // If you're storing token in localStorage
        sessionStorage.removeItem('token'); // If you're storing token in sessionStorage

        // Note: Navigation should be handled in the component that dispatches this thunk
        return true;
    }
);

