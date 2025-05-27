import {createAsyncThunk} from "@reduxjs/toolkit";
import {Achievement, achievementApi} from "@/src/redux/api/achievementAPI";
import {tokenService} from "@/src/services/tokenService";
import {RootState} from "@/src/redux/store"; // Updated import

export interface CombinedAchievementsData {
    achievements: Achievement[];
}

// Thunk to fetch and merge user achievements with all available achievements
export const fetchUserAchievementsThunk = createAsyncThunk<
    CombinedAchievementsData,
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

            // Get all available achievements first
            let allAchievements: Achievement[] = [];
            try {
                const allResponse = await achievementApi.getAllAchievements(token);

                JSON.stringify(allResponse, null, 2);

                if (allResponse && 'achievements' in allResponse && Array.isArray(allResponse.achievements)) {
                    allAchievements = allResponse.achievements;
                } else {
                }
            } catch (error) {
            }

            try {
                const userResponse = await achievementApi.getUserAchievements(token);

                JSON.stringify(userResponse, null, 2);

                if (userResponse && 'achievements' in userResponse && Array.isArray(userResponse.achievements)) {
                    const userAchievements = userResponse.achievements;

                    if (allAchievements.length > 0) {
                        // If we have all achievements, mark the user's earned ones with earned_at
                        const userAchievementsMap = new Map(
                            userAchievements.map(a => [a.id, a])
                        );


                        // For each achievement in allAchievements, check if it's in userAchievements
                        // If it is, copy the earned_at date
                        allAchievements = allAchievements.map(achievement => {
                            const userAchievement = userAchievementsMap.get(achievement.id);
                            if (userAchievement) {
                                return {
                                    ...achievement,
                                    earned_at: userAchievement.earned_at
                                };
                            }
                            return achievement;
                        });

                        return {achievements: allAchievements};
                    } else {
                        // If we don't have all achievements, just use user's achievements
                        return {achievements: userAchievements};
                    }
                } else {
                }
            } catch (error) {
            }

            if (allAchievements.length > 0) {
                return {achievements: allAchievements};
            }

            // If we have no achievements at all, reject
            return rejectWithValue("Failed to fetch any achievements");

        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "An error occurred while fetching achievements"
            );
        }
    }
);

