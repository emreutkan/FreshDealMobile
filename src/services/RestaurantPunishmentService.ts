// src/services/restaurantService.ts

import axios from 'axios';
import {API_BASE_URL} from "@/src/redux/api/API";
import tokenService from './tokenService';

// Define the punishment history type
export interface PunishmentHistory {
    id: number;
    type: string;
    duration_days: number;
    start_date: string;
    end_date: string;
    reason: string;
    is_active: boolean;
    is_reverted: boolean;
    created_by: {
        id: number;
        name: string;
    };
    created_at: string;
    reverted_at?: string;
    reverted_by?: {
        id: number;
        name: string;
    };
}

export interface PunishmentHistoryResponse {
    success: boolean;
    restaurant_name: string;
    punishment_history: PunishmentHistory[];
    timestamp: string;
}

export const getRestaurantPunishmentHistory = async (restaurantId: number): Promise<PunishmentHistoryResponse> => {
    try {
        const token = await tokenService.getToken();
        const response = await axios.get<PunishmentHistoryResponse>(
            `${API_BASE_URL}/restaurants/${restaurantId}/punishment-history`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};