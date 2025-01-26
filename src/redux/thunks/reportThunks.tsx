// reportThunks.ts
import {createAsyncThunk} from '@reduxjs/toolkit';
import {addReport, setReportError, setReportLoading, setReports, setUploadProgress,} from '../slices/reportSlice';
import {createReport, CreateReportRequest, getUserReports} from '@/src/redux/api/reportAPI';
import {RootState} from '@/src/types/store';

export const createReportThunk = createAsyncThunk(
    'report/create',
    async (reportData: CreateReportRequest, {dispatch, getState}) => {
        try {
            dispatch(setReportLoading(true));
            dispatch(setReportError(null));
            dispatch(setUploadProgress(0));

            const state = getState() as RootState;
            const token = state.user.token;
            if (!token) {
                throw new Error('User is not authenticated');
            }

            // Create FormData
            const formData = new FormData();
            formData.append('purchase_id', reportData.purchase_id.toString());
            formData.append('description', reportData.description);
            formData.append('image', reportData.image);

            // Log creation attempt with timestamp
            console.log(`[${new Date().toISOString()}] Attempting to create report for purchase ${reportData.purchase_id}`);

            const response = await createReport(
                reportData,
                token,
                (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    dispatch(setUploadProgress(progress));
                }
            );

            // Log successful creation
            console.log(`[${new Date().toISOString()}] Report created successfully for purchase ${reportData.purchase_id}`);

            dispatch(addReport(response));
            return response;
        } catch (error: any) {
            // Log error with timestamp
            console.error(`[${new Date().toISOString()}] Error creating report:`, error);

            const errorMessage = error.response?.data?.message || 'Failed to create report';
            dispatch(setReportError(errorMessage));
            throw error;
        } finally {
            dispatch(setReportLoading(false));
        }
    }
);

export const fetchUserReportsThunk = createAsyncThunk(
    'report/fetchUserReports',
    async (_, {dispatch, getState}) => {
        try {
            dispatch(setReportLoading(true));
            dispatch(setReportError(null));

            const state = getState() as RootState;
            const token = state.user.token;
            if (!token) {
                throw new Error('User is not authenticated');
            }

            // Log fetch attempt
            console.log(`[${new Date().toISOString()}] Fetching user reports`);

            const reports = await getUserReports(token);

            // Log successful fetch
            console.log(`[${new Date().toISOString()}] Successfully fetched ${reports.length} reports`);

            dispatch(setReports(reports));
            return reports;
        } catch (error: any) {
            // Log error with timestamp
            console.error(`[${new Date().toISOString()}] Error fetching reports:`, error);

            const errorMessage = error.response?.data?.message || 'Failed to fetch reports';
            dispatch(setReportError(errorMessage));
            throw error;
        } finally {
            dispatch(setReportLoading(false));
        }
    }
);