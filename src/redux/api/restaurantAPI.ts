// Get Restaurants by Proximity API Call
import axios from "axios";

import {logError, logRequest, logResponse} from "@/src/utils/logger";
import {API_BASE_URL} from "@/src/redux/api/API";
import {Restaurant} from "@/src/types/api/restaurant/model";

const RESTAURANTS_ENDPOINT = `${API_BASE_URL}/restaurants`;
const GET_RESTAURANTS_IN_PROXIMITY_API_ENDPOINT = `${RESTAURANTS_ENDPOINT}/proximity`;

export const getRestaurantsInProximity = async (
    latitude: number,
    longitude: number,
    radius: number = 10, // Default to 10 km
    token: string
): Promise<Restaurant[]> => {
    const functionName = 'getRestaurantsByProximityAPI';
    const endpoint = GET_RESTAURANTS_IN_PROXIMITY_API_ENDPOINT;
    const payload = {latitude, longitude, radius};

    logRequest(functionName, endpoint, payload);

    try {
        const response = await axios.post(endpoint, payload, {
            headers: {Authorization: `Bearer ${token.trim()}`},
        });
        logResponse(functionName, endpoint, response.data);
        return response.data.restaurants;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};


// Get a Single Restaurant API Call
export const getRestaurant = async (restaurantId: number): Promise<Restaurant> => {
    const functionName = 'getRestaurant';
    const endpoint = `${RESTAURANTS_ENDPOINT}/${restaurantId}`;

    logRequest(functionName, endpoint, {});

    try {
        const response = await axios.get(endpoint);
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// Get All Restaurants for Owner API Call
export const getAllRestaurants = async (token: string): Promise<Restaurant[]> => {
    const functionName = 'getAllRestaurants';

    logRequest(functionName, RESTAURANTS_ENDPOINT, {});

    try {
        const response = await axios.get(RESTAURANTS_ENDPOINT, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, RESTAURANTS_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, RESTAURANTS_ENDPOINT, error);
        throw error;
    }
};

