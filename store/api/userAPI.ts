// api/userAPI.ts
import axios from 'axios';
import {logError, logRequest, logResponse} from "@/src/utils/logger";
import {API_BASE_URL} from "@/store/api/API";

const USER_ENDPOINT = `${API_BASE_URL}/user`;
const UPDATE_USERNAME_ENDPOINT = `${USER_ENDPOINT}/username`;
const UPDATE_EMAIL_ENDPOINT = `${USER_ENDPOINT}/email`;
const UPDATE_PASSWORD_ENDPOINT = `${USER_ENDPOINT}/password`;
const FAVORITES_ENDPOINT = `${USER_ENDPOINT}/favorites`;

export const updateUsernameAPI = async (newUsername: string, token: string) => {
    const functionName = 'updateUsername';
    const payload = {username: newUsername};
    logRequest(functionName, UPDATE_USERNAME_ENDPOINT, payload);
    try {
        const response = await axios.put(
            UPDATE_USERNAME_ENDPOINT,
            payload,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        logResponse(functionName, UPDATE_USERNAME_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, UPDATE_USERNAME_ENDPOINT, error);
        throw error;
    }
};

// Update Email API Call
export const updateEmailAPI = async (oldEmail: string, newEmail: string, token: string) => {
    const functionName = 'updateEmail';
    const payload = {old_email: oldEmail, new_email: newEmail};

    logRequest(functionName, UPDATE_EMAIL_ENDPOINT, payload);

    try {
        const response = await axios.put(
            UPDATE_EMAIL_ENDPOINT,
            payload,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        logResponse(functionName, UPDATE_EMAIL_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, UPDATE_EMAIL_ENDPOINT, error);
        throw error;
    }
};

export const updatePasswordAPI = async (oldPassword: string, newPassword: string, token: string) => {
    const functionName = 'updatePassword';
    const payload = {old_password: oldPassword, new_password: newPassword};

    logRequest(functionName, UPDATE_PASSWORD_ENDPOINT, payload);

    try {
        const response = await axios.put(
            UPDATE_PASSWORD_ENDPOINT,
            payload,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        logResponse(functionName, UPDATE_PASSWORD_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, UPDATE_PASSWORD_ENDPOINT, error);
        throw error;
    }
};

export const getUserDataAPI = async (token: string) => {
    const functionName = 'getUserData';
    try {
        const response = await axios.get(USER_ENDPOINT, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, USER_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, USER_ENDPOINT, error);
        throw error;
    }
};


export const addToFavoritesAPI = async (restaurantId: string, token: string) => {
    const functionName = 'addToFavorites';
    const payload = {restaurant_id: restaurantId};

    logRequest(functionName, FAVORITES_ENDPOINT, payload);

    try {
        const response = await axios.post(FAVORITES_ENDPOINT, payload, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, FAVORITES_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, FAVORITES_ENDPOINT, error);
        throw error;
    }
};

export const removeFromFavoritesAPI = async (restaurantId: number, token: string) => {
    const functionName = 'removeFromFavoritesAPI';
    const payload = {restaurant_id: restaurantId};

    logRequest(functionName, FAVORITES_ENDPOINT, payload);

    try {
        const response = await axios.delete(FAVORITES_ENDPOINT, {
            headers: {Authorization: `Bearer ${token}`},
            data: payload
        });
        logResponse(functionName, FAVORITES_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, FAVORITES_ENDPOINT, error);
        throw error;
    }
};

// Get Favorites API Call
export const getFavoritesAPI = async (token: string): Promise<string[]> => {
    const functionName = 'getFavorites';

    logRequest(functionName, FAVORITES_ENDPOINT, {});

    try {
        const response = await axios.get(FAVORITES_ENDPOINT, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, FAVORITES_ENDPOINT, response.data);
        return response.data.favorites;
    } catch (error: any) {
        logError(functionName, FAVORITES_ENDPOINT, error);
        throw error;
    }
};

