// api/userAPI.ts
import {API_BASE_URL} from "@/src/redux/api/API";
// api/userAPI.ts
import {apiClient} from '@/src/services/apiClient';
import {
    AddFavoriteResponse,
    GetFavoritesResponse,
    RemoveFavoriteResponse,
    UpdateEmailResponse,
    UpdatePasswordResponse,
    UpdateUsernameResponse,
    UserDataResponse
} from "@/src/types/api/user/responses"
import {UserRank} from "@/src/types/states";

const USER_ENDPOINT = `${API_BASE_URL}/user`;

export interface UserSavingsResponse {
    total_discount: number;
    rank: number;  // In case you have multiple currencies
}


export interface UserRankResponse {
    rank: number;
    total_discount: number;
    user_id: number;
    user_name: string;
}

export interface UserRankingsResponse {
    rankings: UserRank[];
}

export const userApi = {
    async updateUsername(newUsername: string, token: string): Promise<UpdateUsernameResponse> {
        return apiClient.request({
            method: 'PUT',
            url: `${USER_ENDPOINT}/username`,
            data: {username: newUsername},
            token,
        });
    },

    async updateEmail(oldEmail: string, newEmail: string, token: string): Promise<UpdateEmailResponse> {
        return apiClient.request({
            method: 'PUT',
            url: `${USER_ENDPOINT}/email`,
            data: {old_email: oldEmail, new_email: newEmail},
            token,
        });
    },
    async updatePassword(oldPassword: string, newPassword: string, token: string): Promise<UpdatePasswordResponse> {
        return apiClient.request({
            method: 'PUT',
            url: `${USER_ENDPOINT}/password`,
            data: {old_password: oldPassword, new_password: newPassword},
            token,
        });
    },

    async getUserData(token: string): Promise<UserDataResponse> {
        return apiClient.request({
            method: 'GET',
            url: USER_ENDPOINT,
            token,
        });
    },

    async addToFavorites(restaurantId: number, token: string): Promise<AddFavoriteResponse> {
        return apiClient.request({
            method: 'POST',
            url: `${USER_ENDPOINT}/favorites`,
            data: {restaurant_id: restaurantId},
            token,
        });
    },

    async removeFromFavorites(restaurantId: number, token: string): Promise<RemoveFavoriteResponse> {
        return apiClient.request({
            method: 'DELETE',
            url: `${USER_ENDPOINT}/favorites`,
            data: {restaurant_id: restaurantId},
            token,
        });
    },

    async getFavorites(token: string): Promise<GetFavoritesResponse> {
        return apiClient.request({
            method: 'GET',
            url: `${USER_ENDPOINT}/favorites`,
            token,
        });
    },

    async getUserRank(userId: number, token: string): Promise<UserRankResponse> {
        return apiClient.request({
            method: 'GET',
            url: `${API_BASE_URL}/user/rank/${userId}`,
            token,
        });
    },

    async getUserRankings(token: string): Promise<UserRankingsResponse> {
        return apiClient.request({
            method: 'GET',
            url: `${API_BASE_URL}/user/rankings`,
            token,
        });
    },
};
