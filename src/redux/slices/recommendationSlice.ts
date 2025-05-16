import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface RecommendationState {
    recommendationIds: number[];
    loading: boolean;
    error: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: RecommendationState = {
    recommendationIds: [],
    loading: false,
    error: null,
    status: 'idle'
};

const recommendationSlice = createSlice({
    name: 'recommendation',
    initialState,
    reducers: {
        getRecommendationsStart(state) {
            state.loading = true;
            state.status = 'loading';
            state.error = null;
        },
        getRecommendationsSuccess(state, action: PayloadAction<number[]>) {
            state.recommendationIds = action.payload;
            state.loading = false;
            state.status = 'succeeded';
            state.error = null;
        },
        getRecommendationsFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.status = 'failed';
            state.error = action.payload;
        }
    }
});

export const {
    getRecommendationsStart,
    getRecommendationsSuccess,
    getRecommendationsFailed
} = recommendationSlice.actions;

export default recommendationSlice.reducer;