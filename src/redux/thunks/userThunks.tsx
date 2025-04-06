// userThunks.ts

import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "@/src/types/store";
import {tokenService} from "@/src/services/tokenService";
import {userApi, UserSavingsResponse} from "@/src/redux/api/userAPI";
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
    UpdateUsernameResponse,
    UserDataResponse
} from "@/src/types/api/user/responses";
import {setToken} from "@/src/redux/slices/userSlice";
import {API_BASE_URL} from "@/src/redux/api/API";
import {apiClient} from "expo-dev-launcher/bundle/apiClient";
import {UserRank} from "@/src/types/states";

export const loginUserThunk = createAsyncThunk<
    LoginResponse,
    LoginPayload,
    { state: RootState; rejectValue: string }
>(
    "user/loginUser",
    async (payload, {dispatch, rejectWithValue}) => {
        try {
            const response = await authApi.login(payload);
            console.log(response)

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
            const response = await authApi.register(userData);
            return {
                success: response.success,
                message: response.message,
            } as RegisterResponse;
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
    async ({username}, {dispatch, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }
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
    async ({old_email, new_email}, {dispatch, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }
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
    async ({old_password, new_password}, {dispatch, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }
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
    async ({restaurant_id}, {dispatch, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }
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
    async ({restaurant_id}, {dispatch, rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }
            const response = await userApi.removeFromFavorites(restaurant_id, token);
            await dispatch(getFavoritesThunk());
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
    async (_, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }
            const response = await userApi.getFavorites(token);
            return {favorites: response.favorites};
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch favorites"
            );
        }
    }
);

export const getUserSavingsThunk = createAsyncThunk<
    UserSavingsResponse,
    void,
    { state: RootState; rejectValue: string }
>(
    "user/getUserSavings",
    async (_, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }

            // Make API call to get user's savings statistics
            const response = await userApi.getUserSavings(token);
            return response;
        } catch (error: any) {
            console.log("Error fetching user savings:", error);
            // Return a default value in case of error during development
            return {
                total_money_saved: 0,
                currency: "USD"
            };
        }
    }
);

export const getUserRankThunk = createAsyncThunk<
    UserRank,
    number, // User ID
    { state: RootState; rejectValue: string }
>(
    "user/getUserRank",
    async (userId, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }

            // This endpoint contains both rank and total_discount
            const response = await apiClient.request({
                method: 'GET',
                url: `${API_BASE_URL}/user/rank/${userId}`,
                token,
            });

            console.log("User rank response:", response);

            if (!response || !response.rank) {
                return rejectWithValue("Invalid response format from server");
            }

            return response;
        } catch (error: any) {
            console.log("Error fetching user rank:", error);
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch user rank"
            );
        }
    }
);

// Get all user rankings
export const getUserRankingsThunk = createAsyncThunk<
    UserRank[],
    void,
    { state: RootState; rejectValue: string }
>(
    "user/getUserRankings",
    async (_, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }

            const response = await apiClient.request({
                method: 'GET',
                url: `${API_BASE_URL}/user/rankings`,
                token,
            });

            if (!Array.isArray(response)) {
                return rejectWithValue("Invalid rankings response format");
            }

            return response;
        } catch (error: any) {
            console.log("Error fetching user rankings:", error);
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch user rankings"
            );
        }
    }
);