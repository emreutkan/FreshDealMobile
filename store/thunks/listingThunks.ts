import {createAsyncThunk} from "@reduxjs/toolkit";
import {getListingsAPI} from "@/api/userAPI";
import {Pagination} from "@/store/slices/listingSlice";

export interface Listing {
    id: number;
    restaurant_id: number;
    title: string;
    description: string;
    image_url: string;
    price: number;
    count: number;
}


// Thunks

// Fetch Listings with optional filters and pagination
export const fetchListings = createAsyncThunk<
    { listings: Listing[]; pagination: Pagination },
    { restaurantId?: number; page?: number; perPage?: number }
>(
    'listings/fetchListings',
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
