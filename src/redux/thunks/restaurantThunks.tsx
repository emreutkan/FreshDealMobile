// src/store/thunks/restaurantThunks.ts
import {createAsyncThunk} from '@reduxjs/toolkit';
import {
    addRestaurantComment,
    createRestaurant,
    deleteRestaurant,
    getAllRestaurants,
    getRestaurant,
    getRestaurantsInProximity,
    updateRestaurant
} from "@/src/redux/api/restaurantAPI";
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

// Get a single restaurant
export const getRestaurantThunk = createAsyncThunk<
    Restaurant,
    number,
    { rejectValue: string }
>(
    'restaurant/getRestaurant',
    async (restaurantId, {rejectWithValue}) => {
        try {
            return await getRestaurant(restaurantId);
        } catch (error: any) {
            return rejectWithValue('Failed to fetch restaurant: ' + error.message);
        }
    }
);

// Get all restaurants for owner
export const getAllRestaurantsThunk = createAsyncThunk<
    Restaurant[],
    void,
    { rejectValue: string }
>(
    'restaurant/getAllRestaurants',
    async (_, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            return await getAllRestaurants(token);
        } catch (error: any) {
            return rejectWithValue('Failed to fetch restaurants: ' + error.message);
        }
    }
);

// Create restaurant
export const createRestaurantThunk = createAsyncThunk<
    Restaurant,
    FormData,
    { rejectValue: string }
>(
    'restaurant/createRestaurant',
    async (formData, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            return await createRestaurant(formData, token);
        } catch (error: any) {
            return rejectWithValue('Failed to create restaurant: ' + error.message);
        }
    }
);

// Update restaurant
export const updateRestaurantThunk = createAsyncThunk<
    Restaurant,
    { restaurantId: number; formData: FormData },
    { rejectValue: string }
>(
    'restaurant/updateRestaurant',
    async ({restaurantId, formData}, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            return await updateRestaurant(restaurantId, formData, token);
        } catch (error: any) {
            return rejectWithValue('Failed to update restaurant: ' + error.message);
        }
    }
);

// Delete restaurant
export const deleteRestaurantThunk = createAsyncThunk<
    void,
    number,
    { rejectValue: string }
>(
    'restaurant/deleteRestaurant',
    async (restaurantId, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            await deleteRestaurant(restaurantId, token);
        } catch (error: any) {
            return rejectWithValue('Failed to delete restaurant: ' + error.message);
        }
    }
);

// src/redux/thunks/restaurantThunks.ts
export const addRestaurantCommentThunk = createAsyncThunk<
    void,
    {
        restaurantId: number;
        commentData: {
            comment: string;
            rating: number;
            purchase_id: number;
        };
    },
    { rejectValue: string }
>(
    'restaurant/addComment',
    async ({restaurantId, commentData}, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }

            // Ensure all numeric values are integers
            const sanitizedData = {
                ...commentData,
                rating: parseInt(String(commentData.rating), 10),
                purchase_id: parseInt(String(commentData.purchase_id), 10)
            };

            await addRestaurantComment(restaurantId, sanitizedData, token);
        } catch (error: any) {
            console.error('[addRestaurantComment] Error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
        }
    }
);