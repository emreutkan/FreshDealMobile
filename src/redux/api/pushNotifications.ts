// src/redux/api/pushNotifications.ts
import {apiClient} from "@/src/services/apiClient";
import {API_BASE_URL} from "@/src/redux/api/API";
import {Platform} from 'react-native';
import * as Device from 'expo-device';
import {tokenService} from "@/src/services/tokenService";

interface PushTokenResponse {
    success: boolean;
    message: string;
}

interface PushTokenPayload {
    push_token: string;
    device_type: 'ios' | 'android' | 'unknown';
    platform: string;
}

const cleanPushToken = (token: string): string => {
    // Remove 'ExponentPushToken[' prefix and ']' suffix
    return token.replace('ExponentPushToken[', '').replace(']', '');
};

export const pushNotificationsApi = {
    updatePushToken: async (expoPushToken: string): Promise<PushTokenResponse> => {
        // Get the JWT token
        const jwtToken = await tokenService.getToken();

        if (!jwtToken) {
            throw new Error('No JWT token available');
        }

        // Clean the push token before sending
        const cleanedToken = cleanPushToken(expoPushToken);

        const payload: PushTokenPayload = {
            push_token: cleanedToken,
            device_type: Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'unknown',
            platform: `${Platform.OS} ${Device.osVersion}`,
        };

        try {
            const response = await apiClient.request<PushTokenResponse>({
                method: 'POST',
                url: `${API_BASE_URL}/users/push-token`,
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                data: payload,
            });
            return response;
        } catch (error) {
            console.error('Failed to update push token:', error);
            throw error;
        }
    },

    deleteToken: async (expoPushToken: string): Promise<PushTokenResponse> => {
        const jwtToken = await tokenService.getToken();

        if (!jwtToken) {
            throw new Error('No JWT token available');
        }

        // Clean the push token before sending
        const cleanedToken = cleanPushToken(expoPushToken);

        try {
            const response = await apiClient.request<PushTokenResponse>({
                method: 'DELETE',
                url: `${API_BASE_URL}/users/push-token`,
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                data: {push_token: cleanedToken},
            });
            return response;
        } catch (error) {
            console.error('Failed to delete push token:', error);
            throw error;
        }
    },
};