import {createAsyncThunk} from '@reduxjs/toolkit';
import {getRestaurantsByProximityAPI} from "@/api/userAPI";
import {Restaurant} from "@/store/slices/restaurantSlice";
import {RootState} from "@/store/store";

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
            if (!token) throw new Error('Authentication token is missing.');
            const data = await getRestaurantsByProximityAPI(latitude, longitude, radius, token);
            return data as Restaurant[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to fetch restaurants');
        }
    }
);
