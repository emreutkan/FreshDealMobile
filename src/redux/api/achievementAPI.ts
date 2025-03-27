import {API_BASE_URL} from "@/src/redux/api/API";
import {apiClient} from '@/src/services/apiClient';
import {logError, logRequest, logResponse} from "@/src/utils/logger";

const USER_ACHIEVEMENTS_ENDPOINT = `${API_BASE_URL}/user/achievements`;
const ALL_ACHIEVEMENTS_ENDPOINT = `${API_BASE_URL}/achievements`;

// Updated Achievement interface
export interface Achievement {
    id: number;
    name: string;
    achievement_type: string;
    badge_image_url: string;
    description: string;
    earned_at?: string; // Optional because not all achievements are earned
    unlocked: boolean;  // Add this to track unlock status
}

export interface AchievementsResponse {
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
            logResponse(functionName, endpoint, response);
            return response;
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
            logResponse(functionName, endpoint, response);
            return response;
        } catch (error: any) {
            logError(functionName, endpoint, error);
            throw error;
        }
    }
};