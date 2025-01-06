// api/userAPI.ts
import axios from 'axios';
// import {Address, Restaurant} from "@/store/userSlice";
import {Address} from "@/store/slices/addressSlice";
import {Restaurant} from "@/store/slices/restaurantSlice";

const API_BASE_URL = 'https://freshdealapi-fkfaajfaffh4c0ex.uksouth-01.azurewebsites.net';
// const API_BASE_URL = 'http://192.168.1.3:8080';

const CHANGE_USERNAME = `${API_BASE_URL}/v1/user/changeUsername`;
const CHANGE_PASSWORD = `${API_BASE_URL}/v1/user/changePassword`;
const CHANGE_EMAIL = `${API_BASE_URL}/v1/user/changeUsername`;
const LOGIN_API_ENDPOINT = `${API_BASE_URL}/v1/login`;
const REGISTER_API_ENDPOINT = `${API_BASE_URL}/v1/register`;
const ADD_ADDRESS_API_ENDPOINT = `${API_BASE_URL}/v1/add_customer_address`;
const GET_ADDRESSES_API_ENDPOINT = `${API_BASE_URL}/v1/get_customer_addresses`;
const DELETE_ADDRESS_API_ENDPOINT = `${API_BASE_URL}/v1/delete_customer_address`;
const GET_USER_DATA_API_ENDPOINT = `${API_BASE_URL}/v1/user/data`;
const GET_RESTAURANTS_IN_PROXIMITY_API_ENDPOINT = `${API_BASE_URL}/v1/get_restaurants_proximity`;

// Helper function for logging
const logRequest = (functionName: string, endpoint: string, payload: any) => {
    console.log(`[REQUEST] [${functionName}] Endpoint: ${endpoint}`);
    console.log(`[REQUEST] [${functionName}] Payload:`, JSON.stringify(payload, null, 2));
};

const logResponse = (functionName: string, endpoint: string, response: any) => {
    console.log(`[RESPONSE] [${functionName}] Endpoint: ${endpoint}`);
    console.log(`[RESPONSE] [${functionName}] Data:`, JSON.stringify(response, null, 2));
};

const logError = (functionName: string, endpoint: string, error: any) => {
    console.error(`[ERROR] [${functionName}] Endpoint: ${endpoint}`);
    if (error.response) {
        console.error(`[ERROR] [${functionName}] Status: ${error.response.status}`);
        console.error(`[ERROR] [${functionName}] Data:`, error.response.data);
    } else {
        console.error(`[ERROR] [${functionName}] Message: ${error.message}`);
    }
};

// Flexible Login API Call
export const loginUserAPI = async (payload: {
    email?: string;
    phone_number?: string;
    password?: string;
    verification_code?: string;
    step?: "send_code" | "verify_code" | "skip_verification";
    login_type?: "email" | "phone_number";
    password_login?: boolean;
}) => {
    const functionName = 'loginUserAPI';
    const endpoint = LOGIN_API_ENDPOINT;

    logRequest(functionName, endpoint, payload);

    try {
        const response = await axios.post(endpoint, payload);
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// User Registration API Call
export const registerUserAPI = async (userData: {
    name_surname: string;
    email?: string;
    phone_number?: string;
    password: string;
}) => {
    const functionName = 'registerUserAPI';
    const endpoint = REGISTER_API_ENDPOINT;

    logRequest(functionName, endpoint, userData);

    try {
        const response = await axios.post(endpoint, userData); // Adjust the endpoint
        logResponse(functionName, endpoint, response.data);
        console.log('Request URL:', axios.getUri({method: 'POST', url: endpoint})); // Logs full URL
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error; // Re-throw error for thunk to handle
    }
};

export async function addAddressAPI(address: Omit<Address, 'id'>, token: string): Promise<Address> {
    const functionName = 'addAddressAPI';
    const endpoint = ADD_ADDRESS_API_ENDPOINT;
    const payload = address;

    logRequest(functionName, endpoint, payload);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(address),
        });
        const responseData = await response.json();
        logResponse(functionName, endpoint, responseData);

        if (!response.ok) {
            console.error(`[ERROR] [${functionName}] Status: ${response.status}`);
            console.error(`[ERROR] [${functionName}] Response:`, responseData);
            throw new Error(JSON.stringify(responseData));
        }

        return responseData; // Ensure it matches `Address` structure
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
}

export const updateUsernameAPI = async (newUsername: string, token: string) => {
    const functionName = 'updateUsernameAPI';
    const endpoint = CHANGE_USERNAME;
    const payload = {username: newUsername};

    logRequest(functionName, endpoint, payload);

    try {
        const response = await axios.post(
            endpoint,
            payload,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

export const updateEmailAPI = async (oldEmail: string, newEmail: string, token: string) => {
    const functionName = 'updateEmailAPI';
    const endpoint = CHANGE_EMAIL;
    const payload = {old_email: oldEmail, new_email: newEmail};

    logRequest(functionName, endpoint, payload);

    try {
        const response = await axios.post(
            endpoint,
            payload,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

export const updatePasswordAPI = async (oldPassword: string, newPassword: string, token: string) => {
    const functionName = 'updatePasswordAPI';
    const endpoint = CHANGE_PASSWORD;
    const payload = {old_password: oldPassword, new_password: newPassword};

    logRequest(functionName, endpoint, payload);

    try {
        const response = await axios.post(
            endpoint,
            payload,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

export const getUserDataAPI = async (token: string) => {
    const functionName = 'getUserDataAPI';
    const endpoint = GET_USER_DATA_API_ENDPOINT;

    console.log(`[REQUEST] [${functionName}] Endpoint: ${endpoint}`);
    console.log(`[REQUEST] [${functionName}] No payload for GET request.`);

    try {
        const response = await axios.get(endpoint, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
}

export const getAddressAPI = async (token: string) => {
    const functionName = 'getAddressAPI';
    const endpoint = GET_ADDRESSES_API_ENDPOINT;

    console.log(`[REQUEST] [${functionName}] Endpoint: ${endpoint}`);
    console.log(`[REQUEST] [${functionName}] No payload for GET request.`);

    try {
        const response = await axios.get(endpoint, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
}

export const deleteAddressAPI = async (addressId: string, token: string) => {
    const functionName = 'deleteAddressAPI';
    const endpoint = DELETE_ADDRESS_API_ENDPOINT;
    const payload = {address_id: addressId};

    logRequest(functionName, endpoint, payload);

    try {
        const response = await axios.delete(endpoint, {
            headers: {Authorization: `Bearer ${token}`},
            data: payload
        });
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
}

export const getRestaurantsByProximityAPI = async (
    latitude: number,
    longitude: number,
    radius: number, // 10 defaults
    token: string // Required for authentication
): Promise<Restaurant[]> => {
    const functionName = 'getRestaurantsByProximityAPI';
    const endpoint = GET_RESTAURANTS_IN_PROXIMITY_API_ENDPOINT;
    const payload = {latitude, longitude, radius};

    logRequest(functionName, endpoint, payload);

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token.trim()}`, // Ensure proper format
            },
        };

        const response = await axios.post(endpoint, payload, config);
        logResponse(functionName, endpoint, response.data);
        return response.data.restaurants; // Adjust based on your API's response structure
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};
