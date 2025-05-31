// src/redux/slices/punishmentHistorySlice.ts

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getRestaurantPunishmentHistory, PunishmentHistoryResponse} from '@/src/services/RestaurantPunishmentService';

interface PunishmentHistoryState {
    data: PunishmentHistoryResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: PunishmentHistoryState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchPunishmentHistory = createAsyncThunk(
    'punishmentHistory/fetch',
    async (restaurantId: number, {rejectWithValue}) => {
        try {
            const response = await getRestaurantPunishmentHistory(restaurantId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch punishment history');
        }
    }
);

const punishmentHistorySlice = createSlice({
    name: 'punishmentHistory',
    initialState,
    reducers: {
        clearPunishmentHistory: (state) => {
            state.data = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPunishmentHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPunishmentHistory.fulfilled, (state, action: PayloadAction<PunishmentHistoryResponse>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchPunishmentHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {clearPunishmentHistory} = punishmentHistorySlice.actions;
export default punishmentHistorySlice.reducer;