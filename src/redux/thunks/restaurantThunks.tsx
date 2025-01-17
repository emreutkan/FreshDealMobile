// src/store/thunks/restaurantThunks.ts
import {createAsyncThunk} from '@reduxjs/toolkit';
import {getRestaurantsInProximity} from "@/src/redux/api/restaurantAPI";
import {RootState} from "@/src/types/store";
import {tokenService} from "@/src/services/tokenService";
import {Restaurant} from "@/src/types/api/restaurant/model";
import {Listing} from "@/src/types/api/listing/model";
import {getListingsAPI} from "@/src/redux/api/listingsAPI";
import {Pagination} from "@/src/types/states";

// Get restaurants by proximity
// Get restaurants by proximity
export const getRestaurantsByProximity = createAsyncThunk<
    Restaurant[],
    void,
    { state: RootState; rejectValue: string }
>(
    'restaurant/getRestaurantsByProximity',
    async (_, {rejectWithValue, getState}) => {
        try {
            const address = getState().address.addresses.find(
                (address) => address.is_primary
            );
            if (!address) {
                console.error('Primary address is missing.');
                return rejectWithValue('Primary address is missing.');
            }

            const token = await tokenService.getToken();
            if (!token) {
                console.error('Authentication token is missing.');
                return rejectWithValue('Authentication token is missing.');
            }

            const radius = getState().restaurant.radius;
            const data = await getRestaurantsInProximity(
                address.latitude,
                address.longitude,
                radius,
                token
            );
            return data as Restaurant[];
        } catch (error: any) {
            return rejectWithValue('Failed to fetch restaurants: ' + error.message);
        }
    }
);


// Fetch Listings with optional filters and pagination
export const getListingsThunk = createAsyncThunk<
    { listings: Listing[]; pagination: Pagination },
    { restaurantId: number; page?: number; perPage?: number }
>(
    'listings/getListingsThunk',
    async (params, {rejectWithValue}) => {
        try {
            const data = await getListingsAPI(params);
            return {
                listings: data.data,
                pagination: data.pagination,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
