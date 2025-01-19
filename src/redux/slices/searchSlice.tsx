import {createSlice} from "@reduxjs/toolkit";
import {SearchforRestaurantsThunk} from "@/src/redux/thunks/searchThunks";
import {SearchState} from "@/src/types/states";


const initialState: SearchState = {
    searchResults: {
        results: [],

    },
    loading: false,
    error: null,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase('user/logout', (state) => {
                return initialState;
            }).addCase(SearchforRestaurantsThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(SearchforRestaurantsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults.results = action.payload.results;
            })
            .addCase(SearchforRestaurantsThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.error?.message || 'Search failed';
            })
    }
});

export default searchSlice.reducer;
