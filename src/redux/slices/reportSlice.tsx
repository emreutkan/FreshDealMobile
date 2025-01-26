// reportSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Report} from "@/src/redux/api/reportAPI";

export interface ReportState {
    reports: Report[];
    loading: boolean;
    error: string | null;
    uploadProgress: number; // Add upload progress tracking
}

const initialState: ReportState = {
    reports: [],
    loading: false,
    error: null,
    uploadProgress: 0, // Initialize upload progress
};

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        setReportLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
            if (action.payload === false) {
                state.uploadProgress = 0; // Reset progress when loading is complete
            }
        },
        setReportError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.uploadProgress = 0; // Reset progress on error
        },
        setReports: (state, action: PayloadAction<Report[]>) => {
            state.reports = action.payload;
        },
        addReport: (state, action: PayloadAction<Report>) => {
            state.reports.push(action.payload);
        },
        setUploadProgress: (state, action: PayloadAction<number>) => {
            state.uploadProgress = action.payload;
        },
    },
});

export const {
    setReportLoading,
    setReportError,
    setReports,
    addReport,
    setUploadProgress,
} = reportSlice.actions;

export default reportSlice.reducer;