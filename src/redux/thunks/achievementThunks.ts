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
        console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Started execution");

        try {
            const token = await tokenService.getToken();
            if (!token) {
                console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: No authentication token found");
                return rejectWithValue("Authentication token is missing");
            }
            console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Token retrieved successfully");

            // Get all available achievements first
            let allAchievements: Achievement[] = [];
            try {
                console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Fetching all achievements");
                const allResponse = await achievementApi.getAllAchievements(token);

                console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: All achievements response:",
                    JSON.stringify(allResponse, null, 2));

                if (allResponse && 'achievements' in allResponse && Array.isArray(allResponse.achievements)) {
                    allAchievements = allResponse.achievements;
                    console.log(`[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Retrieved ${allAchievements.length} total achievements`);
                } else {
                    console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Invalid all achievements response format");
                }
            } catch (error) {
                console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Error fetching all achievements:", error);
                // Don't reject here, continue to try fetching user achievements
            }

            // Get user's unlocked achievements
            try {
                console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Fetching user achievements");
                const userResponse = await achievementApi.getUserAchievements(token);

                console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: User achievements response:",
                    JSON.stringify(userResponse, null, 2));

                if (userResponse && 'achievements' in userResponse && Array.isArray(userResponse.achievements)) {
                    const userAchievements = userResponse.achievements;
                    console.log(`[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Retrieved ${userAchievements.length} user achievements`);

                    if (allAchievements.length > 0) {
                        // If we have all achievements, mark the user's earned ones with earned_at
                        const userAchievementsMap = new Map(
                            userAchievements.map(a => [a.id, a])
                        );

                        console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Combining all and user achievements");

                        // For each achievement in allAchievements, check if it's in userAchievements
                        // If it is, copy the earned_at date
                        allAchievements = allAchievements.map(achievement => {
                            const userAchievement = userAchievementsMap.get(achievement.id);
                            if (userAchievement) {
                                console.log(`[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Marking achievement ${achievement.id} as earned at ${userAchievement.earned_at}`);
                                return {
                                    ...achievement,
                                    earned_at: userAchievement.earned_at
                                };
                            }
                            return achievement;
                        });

                        console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Successfully combined achievements");
                        return {achievements: allAchievements};
                    } else {
                        // If we don't have all achievements, just use user's achievements
                        console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Using only user achievements since all achievements failed");
                        return {achievements: userAchievements};
                    }
                } else {
                    console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Invalid user achievements response format");
                }
            } catch (error) {
                console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Error fetching user achievements:", error);
                // Continue with all achievements if available
            }

            // If we got here, either we only have all achievements or no achievements at all
            if (allAchievements.length > 0) {
                console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Returning only all achievements");
                return {achievements: allAchievements};
            }

            // If we have no achievements at all, reject
            console.log("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Failed to fetch any achievements");
            return rejectWithValue("Failed to fetch any achievements");

        } catch (error: any) {
            console.error("[DEBUG][2025-04-06 20:00:32][emreutkan] Achievement Thunk: Critical error:", error);
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "An error occurred while fetching achievements"
            );
        }
    }
);