// src/store/thunks/restaurantThunks.ts
import {createAsyncThunk} from '@reduxjs/toolkit';
import {getRestaurantsInProximity} from "@/src/redux/api/restaurantAPI";
import {Restaurant} from '@/src/redux/slices/restaurantSlice';
import {RootState} from '@/src/redux/store';

// Get restaurants by proximity
export const getRestaurantsByProximity = createAsyncThunk<
    Restaurant[],
    { radius?: number },
    { state: RootState; rejectValue: string }
>(
    'restaurant/getRestaurantsByProximity',
    async ({radius}, {rejectWithValue, getState}) => {
        try {
            const address = getState().address.addresses.find(
                (address) => address.is_primary
            );
            if (!address) {
                console.error('Primary address is missing.');
                return rejectWithValue('Primary address is missing.');
            }
            const token = getState().user.token;
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }
            const data = await getRestaurantsInProximity(address.latitude, address.longitude, radius, token);
            return data as Restaurant[];
        } catch (error: any) {
            return rejectWithValue('Failed to fetch restaurants: ' + error.message);
        }
    }
);

