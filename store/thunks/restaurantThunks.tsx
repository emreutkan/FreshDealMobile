import {createAsyncThunk} from '@reduxjs/toolkit';
import {API_BASE_URL, getRestaurantsByProximityAPI} from "@/api/userAPI";
import {Restaurant} from "@/store/slices/restaurantSlice";
import {RootState} from "@/store/store";
import axios from "axios";

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
        } catch (error) {
            return rejectWithValue('Failed to fetch restaurants' + {error});
        }
    }
);


const GET_FAVORITIES_ENDPOINT = `${API_BASE_URL}/v1/favorites`;


export const getFavorites = createAsyncThunk<
    string[], // The thunk returns an array of favorite restaurant IDs
    void,
    { state: RootState; rejectValue: string }
>(
    "user/getFavorites",
    async (_, {getState, rejectWithValue}) => {
        try {
            const token = getState().user.token;

            if (!token) {
                return rejectWithValue("User token is missing. Please log in.");
            }

            const response = await axios.get(GET_FAVORITIES_ENDPOINT, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Favorites:', response.data.favorites);

            if (response.data.favorites) {
                return response.data.favorites

                // return response.data.favorites.map((fav: { restaurant_id: string }) => fav.restaurant_id);
            } else {
                return rejectWithValue(response.data.message || "Failed to fetch favorites.");
            }
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch favorites.");
        }
    }
);


export const addToFavoritesAPI = async (restaurantId: string, token: string) => {
    const functionName = 'addToFavoritesAPI';
    const endpoint = `${API_BASE_URL}/v1/favorites`;
    const payload = {restaurant_id: restaurantId};


    try {
        const response = await axios.post(endpoint, payload, {
            headers: {Authorization: `Bearer ${token}`},
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

// Remove from Favorites API Call
export const removeFromFavoritesAPI = async (restaurantId: string, token: string) => {
    const functionName = 'removeFromFavoritesAPI';
    const endpoint = `${API_BASE_URL}/v1/favorites`;
    const payload = {restaurant_id: restaurantId};


    try {
        const response = await axios.delete(endpoint, {
            headers: {Authorization: `Bearer ${token}`},
            data: payload,
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};
