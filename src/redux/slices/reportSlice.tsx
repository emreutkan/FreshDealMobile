// reportSlice.ts
import {createSlice} from '@reduxjs/toolkit';
import {createReportThunk} from "@/src/redux/thunks/reportThunks";

export interface ReportState {
    error: string | null;
    loading: boolean;
}

const initialState: ReportState = {
    error: null,
    loading: false,
};
const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createReportThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReportThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createReportThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {} = reportSlice.actions;

export default reportSlice.reducer;