import {createAsyncThunk} from "@reduxjs/toolkit";
import {Achievement, achievementApi} from "@/src/redux/api/achievementAPI";
import {tokenService} from "@/src/services/tokenService";
import {RootState} from "@/src/types/store";

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

                if (allResponse && allResponse.achievements) {
                    // Initialize all achievements as locked
                    allAchievements = allResponse.achievements.map(achievement => ({
                        ...achievement,
                        unlocked: false
                    }));
                }
            } catch (error) {
                console.log("Error fetching all achievements:", error);
            }

            // Get user's unlocked achievements
            try {
                const userResponse = await achievementApi.getUserAchievements(token);

                if (userResponse && userResponse.achievements && userResponse.achievements.length > 0) {
                    if (allAchievements.length > 0) {
                        // If we have all achievements, mark the user's ones as unlocked
                        const userAchievementIds = new Set(userResponse.achievements.map(a => a.id));

                        allAchievements = allAchievements.map(achievement => {
                            if (userAchievementIds.has(achievement.id)) {
                                const userAchievement = userResponse.achievements.find(a => a.id === achievement.id);
                                return {
                                    ...achievement,
                                    unlocked: true,
                                    earned_at: userAchievement?.earned_at
                                };
                            }
                            return achievement;
                        });

                        return {achievements: allAchievements};
                    } else {
                        // If we don't have all achievements, just mark user's as unlocked
                        const userAchievements = userResponse.achievements.map(achievement => ({
                            ...achievement,
                            unlocked: true
                        }));

                        return {achievements: userAchievements};
                    }
                }
            } catch (error) {
                console.log("Error fetching user achievements:", error);
            }

            // If we got here, either we only have all achievements or no achievements at all
            if (allAchievements.length > 0) {
                return {achievements: allAchievements};
            }

            // If we have no achievements at all, reject
            return rejectWithValue("Failed to fetch any achievements");

        } catch (error: any) {
            console.error("Critical error in fetchUserAchievementsThunk:", error);
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "An error occurred while fetching achievements"
            );
        }
    }
);