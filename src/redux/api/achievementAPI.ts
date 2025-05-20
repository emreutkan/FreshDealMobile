import {API_BASE_URL} from "@/src/redux/api/API";
import {apiClient} from '@/src/services/apiClient';
import {logError, logRequest, logResponse} from "@/src/utils/logger";

const USER_ACHIEVEMENTS_ENDPOINT = `${API_BASE_URL}/user/achievements`;
const ALL_ACHIEVEMENTS_ENDPOINT = `${API_BASE_URL}/achievements`;

// Interface matching actual API response
export interface Achievement {
    id: number;
    name: string;
    achievement_type: string;
    badge_image_url: string;
    description: string;
    threshold?: number; // From all achievements endpoint
    earned_at?: string; // From user achievements endpoint
}

interface AchievementsResponse {
    achievements: Achievement[];
}

export const achievementApi = {
    // Get user's unlocked achievements
    async getUserAchievements(token: string): Promise<AchievementsResponse> {
        const functionName = 'getUserAchievements';
        const endpoint = USER_ACHIEVEMENTS_ENDPOINT;

        logRequest(functionName, endpoint, {});

        try {
            const response = await apiClient.request({
                method: 'GET',
                url: endpoint,
                token,
            });
            JSON.stringify(response, null, 2);
            logResponse(functionName, endpoint, response);
            return response as AchievementsResponse;
        } catch (error: any) {
            logError(functionName, endpoint, error);
            throw error;
        }
    },

    // Get all available achievements
    async getAllAchievements(token: string): Promise<AchievementsResponse> {
        const functionName = 'getAllAchievements';
        const endpoint = ALL_ACHIEVEMENTS_ENDPOINT;
        logRequest(functionName, endpoint, {});
        try {
            const response = await apiClient.request({
                method: 'GET',
                url: endpoint,
                token,
            });

            JSON.stringify(response, null, 2);

            logResponse(functionName, endpoint, response);


            return response as AchievementsResponse;
        } catch (error: any) {
            logError(functionName, endpoint, error);
            throw error;
        }
    }
};