// services/tokenService.ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_token';

export const tokenService = {
    async setToken(token: string) {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    },

    async getToken() {
        return await SecureStore.getItemAsync(TOKEN_KEY);
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
