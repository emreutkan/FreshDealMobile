// services/tokenService.ts
import * as SecureStore from 'expo-secure-store';
import {Alert} from "react-native";

const TOKEN_KEY = 'user_token';

export interface TokenManager {
    getStateToken: () => string | null;
}

let tokenManager: TokenManager | null = null;

export const initializeTokenService = (manager: TokenManager) => {
    tokenManager = manager;
};

export const tokenService = {
    async setToken(token: string) {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    },

    async getToken() {
        try {
            const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

            if (storedToken) {
                return validateToken(storedToken);
            }

            if (tokenManager) {
                const stateToken = tokenManager.getStateToken();
                return validateToken(stateToken);
            }

            Alert.alert('No token found and no token manager available');
        } catch (error) {
            throw error;
        }
    }
};

export const validateToken = (token: string | null): string => {
    if (!token) {
        throw new Error('Authentication token is missing.');
    }
    return token;
};

export default tokenService;