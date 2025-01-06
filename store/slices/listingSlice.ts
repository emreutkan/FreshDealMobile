// src/store/slices/listingSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {fetchListings} from "@/store/thunks/listingThunks";

export interface Listing {
    id: number;
    restaurant_id: number;
    title: string;
    description: string;
    image_url: string;
    price: number;
    count: number;
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
        builder.addCase(fetchListings.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(
            fetchListings.fulfilled,
            (state, action: PayloadAction<{ listings: Listing[]; pagination: Pagination }>) => {
                state.loading = false;
                state.listings = action.payload.listings;
                state.pagination = action.payload.pagination;
            }
        );
        builder.addCase(fetchListings.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const {clearListings} = listingSlice.actions;

export default listingSlice.reducer;
