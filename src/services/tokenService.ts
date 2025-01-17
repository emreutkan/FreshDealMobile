// services/tokenService.ts
import * as SecureStore from 'expo-secure-store';
import {RootState} from "@/src/types/store";
import {store} from "@/src/redux/store";

const TOKEN_KEY = 'user_token';

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

            // If no token in storage, get it from Redux state
            const stateToken = (store.getState() as RootState).user.token;
            return validateToken(stateToken);
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