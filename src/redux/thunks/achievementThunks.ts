import {createAsyncThunk} from "@reduxjs/toolkit";
import {Achievement, achievementApi} from "@/src/redux/api/achievementAPI";
import {tokenService} from "@/src/services/tokenService";
import {RootState} from "@/src/types/store";

// Thunk to fetch user achievements
export const fetchUserAchievementsThunk = createAsyncThunk<
    Achievement[],
    void,
    { state: RootState; rejectValue: string }
>(
    "achievements/fetchUserAchievements",
    async (_, {rejectWithValue}) => {
        try {
            const token = await tokenService.getToken();
            if (!token) {
                return rejectWithValue("Authentication token is missing");
            }

            const response = await achievementApi.getUserAchievements(token);

            // Check if achievements array exists in the response
            if (response && response.achievements) {
                return response.achievements;
            } else {
                return rejectWithValue("No achievements data in the response");
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch achievements"
            );
        }
    }
);