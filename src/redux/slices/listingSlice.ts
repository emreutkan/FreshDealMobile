// src/store/slices/listingSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getListingsThunk} from "@/src/redux/thunks/listingThunks";
import {logout} from "@/src/redux/slices/userSlice";

export interface Listing {
    id: number;
    restaurant_id: number;
    title: string;
    description: string;
    image_url: string;
    count: number;
    original_price: number | null;
    pick_up_price: number | null;
    delivery_price: number | null;
    consume_within: number | null;
    available_for_pickup: boolean | null;
    available_for_delivery: boolean | null;

}


interface ListingState {
    listings: Listing[];
    loading: boolean;
    error: string | null;
    pagination: Pagination | null;
}

export interface Pagination {
    total: number;
    pages: number;
    current_page: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
}

const initialState: ListingState = {
    listings: [],
    loading: false,
    error: null,
    pagination: null,
};

// Slice

const listingSlice = createSlice({
    name: 'listings',
    initialState,
    reducers: {
        // Optional: Define synchronous actions if needed
        clearListings: (state) => {
            state.listings = [];
            state.pagination = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout, () => initialState) // Reset state on global action

        builder.addCase(getListingsThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(
            getListingsThunk.fulfilled,
            (state, action: PayloadAction<{ listings: Listing[]; pagination: Pagination }>) => {
                state.loading = false;
                state.listings = action.payload.listings;
                state.pagination = action.payload.pagination;
            }
        );
        builder.addCase(getListingsThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const {clearListings} = listingSlice.actions;

export default listingSlice.reducer;
