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
    const response = await axios.post(LOGIN_API_ENDPOINT, payload);
    return response.data;
};

// User Registration API Call
export const registerUserAPI = async (userData: {
    name_surname: string;
    email?: string;
    phone_number?: string;
    password: string;
}) => {
    try {
        const response = await axios.post(REGISTER_API_ENDPOINT, userData); // Adjust the endpoint
        console.log('Request URL:', axios.getUri({method: 'POST', url: REGISTER_API_ENDPOINT})); // Logs full URL
        return response.data;
    } catch (error) {
        console.error('API Request Error:', {
            message: error.message,
            config: error.config,
            stack: error.stack, // Log error stack trace
        });
        throw error; // Re-throw error for thunk to handle
    }
};

export async function addAddressAPI(address: Omit<Address, 'id'>, token: string): Promise<Address> {
    const response = await fetch(ADD_ADDRESS_API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
    });
    console.log(response)
    if (!response.ok) {
        throw new Error(response.toString());
    }

    return await response.json(); // Ensure it matches `Address` structure
}

export const updateUsernameAPI = async (newUsername: string, token: string) => {
    const response = await axios.post(CHANGE_USERNAME,
        {username: newUsername},
        {headers: {Authorization: `Bearer ${token}`}}
    );
    return response.data;
};

export const updateEmailAPI = async (oldEmail: string, newEmail: string, token: string) => {
    const response = await axios.post(CHANGE_EMAIL,
        {old_email: oldEmail, new_email: newEmail},
        {headers: {Authorization: `Bearer ${token}`}}
    );
    return response.data;
};

export const updatePasswordAPI = async (oldPassword: string, newPassword: string, token: string) => {
    const response = await axios.post(CHANGE_PASSWORD,
        {old_password: oldPassword, new_password: newPassword},
        {headers: {Authorization: `Bearer ${token}`}}
    );
    return response.data;
};

export const getUserDataAPI = async (token: string) => {
    const response = await axios.get(GET_USER_DATA_API_ENDPOINT, {
        headers: {Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const getAddressAPI = async (token: string) => {
    const response = await axios.get(GET_ADDRESSES_API_ENDPOINT, {
        headers: {Authorization: `Bearer ${token}`}
    });
    return response.data;
}

export const deleteAddressAPI = async (addressId: string, token: string) => {
    const response = await axios.delete(DELETE_ADDRESS_API_ENDPOINT, {
        headers: {Authorization: `Bearer ${token}`},
        data: {address_id: addressId}
    });
    return response.data;
}
export const getRestaurantsByProximityAPI = async (
    latitude: number,
    longitude: number,
    radius: number, // 10 defaults
    token: string // Required for authentication
): Promise<Restaurant[]> => {
    try {
        const body = {
            latitude,
            longitude,
            radius,
        };

        const config = {
            headers: {
                Authorization: `Bearer ${token.trim()}`, // Ensure proper format
            },
        };

        const response = await axios.post(GET_RESTAURANTS_IN_PROXIMITY_API_ENDPOINT, body, config);
        return response.data.restaurants; // Adjust based on your API's response structure
    } catch (error: any) {
        console.error('getRestaurantsAPI Error:', {
            message: error.message,
            config: error.config,
            response: error.response ? error.response.data : null,
            stack: error.stack,
        });
        throw error;
    }
};
