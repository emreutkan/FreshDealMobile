import {createAsyncThunk} from '@reduxjs/toolkit';
import {apiClient} from '@/src/services/apiClient';
import {API_BASE_URL} from '@/src/redux/api/API';
import {
    getRecommendationsFailed,
    getRecommendationsStart,
    getRecommendationsSuccess
} from '@/src/redux/slices/recommendationSlice';
import {tokenService} from '@/src/services/tokenService';

// Thunk to fetch user recommendations
export const getRecommendationsThunk = createAsyncThunk(
    'recommendation/getRecommendations',
    async (_, {dispatch, rejectWithValue}) => {
        try {
            dispatch(getRecommendationsStart());

            const token = await tokenService.getToken();

            if (!token) {
                return rejectWithValue('No auth token available');
            }

            const response = await apiClient.request({
                method: 'GET',
                url: `${API_BASE_URL}/api/recommendations/users`,
                token,
            });

            if (response.success && Array.isArray(response.data)) {
                dispatch(getRecommendationsSuccess(response.data));
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Invalid response format');
            }
        } catch (error: any) {
            dispatch(getRecommendationsFailed(error.message || 'Unknown error'));
            return rejectWithValue(error.message || 'Failed to fetch recommendations');
        }
    }
);