// src/store/thunks/restaurantThunks.ts
import {createAsyncThunk} from '@reduxjs/toolkit';
import {getRestaurantsInProximity} from "@/store/api/restaurantAPI";
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
            const data = await getRestaurantsInProximity(latitude, longitude, radius, token);
            return data as Restaurant[];
        } catch (error: any) {
            return rejectWithValue('Failed to fetch restaurants: ' + error.message);
        }
    }
);

