// services/tokenService.ts
import * as SecureStore from 'expo-secure-store';

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
            // First try to get token from secure storage
            const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

            if (storedToken) {
                return validateToken(storedToken);
            }

            // If no token in storage and token manager is available, get it from state
            if (tokenManager) {
                const stateToken = tokenManager.getStateToken();
                return validateToken(stateToken);
            }

            throw new Error('No token found and no token manager available');
        } catch (error) {
            // Re-throw the validation error
            throw error;
        }
    },

    async removeToken() {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
};

export const validateToken = (token: string | null): string => {
    if (!token) {
        throw new Error('Authentication token is missing.');
    }
    return token;
};

export default tokenService;