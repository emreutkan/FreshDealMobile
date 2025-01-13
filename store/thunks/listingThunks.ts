import {createAsyncThunk} from "@reduxjs/toolkit";
import {Listing, Pagination} from "@/store/slices/listingSlice";
import {getListingsAPI} from "@/store/api/listingsAPI";


// Thunks

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
