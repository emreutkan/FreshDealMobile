// src/store/thunks/restaurantThunks.ts
import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_BASE_URL, getRestaurantsByProximityAPI} from '@/api/userAPI';
import {Restaurant} from '@/store/slices/restaurantSlice';
import {RootState} from '@/store/store';

// Get restaurants by proximity
export const getRestaurantsByProximity = createAsyncThunk<
    Restaurant[],
    { latitude: number; longitude: number; radius: number },
    { state: RootState; rejectValue: string }
>(
    'restaurant/getRestaurantsByProximity',
    async ({latitude, longitude, radius}, {rejectWithValue, getState}) => {
        try {
            const token = getState().user.token;
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }
            const data = await getRestaurantsByProximityAPI(latitude, longitude, radius, token);
            return data as Restaurant[];
        } catch (error: any) {
            return rejectWithValue('Failed to fetch restaurants: ' + error.message);
        }
    }
);

const GET_FAVORITES_ENDPOINT = `${API_BASE_URL}/v1/favorites`;

// Get favorites
export const getFavorites = createAsyncThunk<
    string[], // The thunk returns an array of favorite restaurant IDs
    void,
    { state: RootState; rejectValue: string }
>(
    'restaurant/getFavorites',
    async (_, {getState, rejectWithValue}) => {
        try {
            const token = getState().user.token;
            if (!token) {
                return rejectWithValue("User token is missing. Please log in.");
            }
            const response = await axios.get(GET_FAVORITES_ENDPOINT, {
                headers: {Authorization: `Bearer ${token}`},
            });
            console.log('Favorites:', response.data.favorites);
            if (response.data.favorites) {
                // Adjust the return type if needed.
                return response.data.favorites as string[];
            } else {
                return rejectWithValue(response.data.message || "Failed to fetch favorites.");
            }
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch favorites.");
        }
    }
);

// Add to favorites thunk
export const addToFavorites = createAsyncThunk<
    string, // return the restaurantId added on success (or any value you like)
    { restaurantId: string },
    { state: RootState; rejectValue: string }
>(
    'restaurant/addToFavorites',
    async ({restaurantId}, {getState, dispatch, rejectWithValue}) => {
        try {
            const token = getState().user.token;
            if (!token) {
                return rejectWithValue("Authentication token is missing.");
            }
            const endpoint = `${API_BASE_URL}/v1/favorites`;
            const payload = {restaurant_id: restaurantId};
            const response = await axios.post(endpoint, payload, {
                headers: {Authorization: `Bearer ${token}`},
            });
            // After successful addition, refresh favorites.
            dispatch(getFavorites());
            return restaurantId;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to add favorite.");
        }
    }
);

// Remove from favorites thunk
export const removeFromFavorites = createAsyncThunk<
    string, // return the restaurantId removed on success (or any value you like)
    { restaurantId: string },
    { state: RootState; rejectValue: string }
>(
    'restaurant/removeFromFavorites',
    async ({restaurantId}, {getState, dispatch, rejectWithValue}) => {
        try {
            const token = getState().user.token;
            if (!token) {
                return rejectWithValue("Authentication token is missing.");
            }
            const endpoint = `${API_BASE_URL}/v1/favorites`;
            const payload = {restaurant_id: restaurantId};
            const response = await axios.delete(endpoint, {
                headers: {Authorization: `Bearer ${token}`},
                data: payload,
            });
            // After successful removal, refresh favorites.
            dispatch(getFavorites());
            return restaurantId;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to remove favorite.");
        }
    }
);
