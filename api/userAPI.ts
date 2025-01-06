// api/userAPI.ts
import axios from 'axios';
// Import necessary types
import {Address} from "@/store/slices/addressSlice";
import {Restaurant, RestaurantCreateResponse} from "@/store/slices/restaurantSlice";
import {Listing} from "@/store/slices/listingSlice";

import {CartItem} from "@/store/slices/cartSlice";

// Define the base URL
const API_BASE_URL = 'https://freshdealapi-fkfaajfaffh4c0ex.uksouth-01.azurewebsites.net';
// const API_BASE_URL = 'http://192.168.1.3:8080';

// Define API endpoints
const CHANGE_USERNAME = `${API_BASE_URL}/v1/update_username`;
const CHANGE_PASSWORD = `${API_BASE_URL}/v1/update_password`;
const CHANGE_EMAIL = `${API_BASE_URL}/v1/update_email`;
const LOGIN_API_ENDPOINT = `${API_BASE_URL}/v1/login`;
const REGISTER_API_ENDPOINT = `${API_BASE_URL}/v1/register`;
const ADD_ADDRESS_API_ENDPOINT = `${API_BASE_URL}/v1/add_customer_address`;
const GET_ADDRESSES_API_ENDPOINT = `${API_BASE_URL}/v1/get_customer_address`;
const DELETE_ADDRESS_API_ENDPOINT = `${API_BASE_URL}/v1/delete_customer_address`;
const GET_USER_DATA_API_ENDPOINT = `${API_BASE_URL}/v1/user/data`;
const GET_RESTAURANTS_IN_PROXIMITY_API_ENDPOINT = `${API_BASE_URL}/v1/get_restaurants_proximity`;
const ADD_RESTAURANT_API_ENDPOINT = `${API_BASE_URL}/v1/add_restaurant`;
const GET_SINGLE_RESTAURANT_API_ENDPOINT = `${API_BASE_URL}/v1/get_restaurant`;
const GET_ALL_RESTAURANTS_API_ENDPOINT = `${API_BASE_URL}/v1/get_restaurants`;
const DELETE_RESTAURANT_API_ENDPOINT = `${API_BASE_URL}/v1/delete_restaurant`;
const GET_LISTINGS_API_ENDPOINT = `${API_BASE_URL}/v1/listings/get_listings`;
const GET_UPLOADED_FILE_API_ENDPOINT = `${API_BASE_URL}/v1/uploads`;
const GET_CART_API_ENDPOINT = `${API_BASE_URL}/v1/cart`;
const ADD_TO_CART_API_ENDPOINT = `${API_BASE_URL}/v1/cart/add`;
const REMOVE_FROM_CART_API_ENDPOINT = `${API_BASE_URL}/v1/cart/remove`;
const UPDATE_CART_API_ENDPOINT = `${API_BASE_URL}/v1/cart/update`;
const SEARCH_API_ENDPOINT = `${API_BASE_URL}/v1/search`;

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

// ------------------------------------
// Existing API Functions
// ------------------------------------

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
    role: "customer" | "owner";
}) => {
    const functionName = 'registerUserAPI';
    const endpoint = REGISTER_API_ENDPOINT;

    logRequest(functionName, endpoint, userData);

    try {
        const response = await axios.post(endpoint, userData);
        logResponse(functionName, endpoint, response.data);
        console.log('Request URL:', axios.getUri({method: 'POST', url: endpoint}));
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// Add Address API Call
export const addAddressAPI = async (address: Omit<Address, 'id'>, token: string): Promise<Address> => {
    const functionName = 'addAddressAPI';
    const endpoint = ADD_ADDRESS_API_ENDPOINT;
    const payload = address;

    logRequest(functionName, endpoint, payload);

    try {
        const response = await axios.post(endpoint, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        logResponse(functionName, endpoint, response.data);
        return response.data; // Ensure it matches `Address` structure
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// Update Username API Call
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

// Update Email API Call
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

// Update Password API Call
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

// Get User Data API Call
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
};

// Get Addresses API Call
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
};

// Delete Address API Call
export const deleteAddressAPI = async (addressId: string, token: string) => {
    const functionName = 'deleteAddressAPI';
    const endpoint = `${DELETE_ADDRESS_API_ENDPOINT}/${addressId}`;
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
};

// Get Restaurants by Proximity API Call
export const getRestaurantsByProximityAPI = async (
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
        return response.data.restaurants; // Adjust based on your API's response structure
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// ------------------------------------
// New API Functions
// ------------------------------------

// Add a New Restaurant API Call
export const addRestaurantAPI = async (restaurantData: {
    restaurantName: string;
    restaurantDescription?: string;
    longitude: number;
    latitude: number;
    category: string;
    workingDays?: string[];
    workingHoursStart?: string;
    workingHoursEnd?: string;
    listings: number;
    image?: File;
}, token: string): Promise<RestaurantCreateResponse> => {
    const functionName = 'addRestaurantAPI';
    const endpoint = ADD_RESTAURANT_API_ENDPOINT;

    logRequest(functionName, endpoint, restaurantData);

    try {
        const formData = new FormData();
        formData.append('restaurantName', restaurantData.restaurantName);
        if (restaurantData.restaurantDescription) formData.append('restaurantDescription', restaurantData.restaurantDescription);
        formData.append('longitude', restaurantData.longitude.toString());
        formData.append('latitude', restaurantData.latitude.toString());
        formData.append('category', restaurantData.category);
        if (restaurantData.workingDays) {
            restaurantData.workingDays.forEach(day => formData.append('workingDays', day));
        }
        if (restaurantData.workingHoursStart) formData.append('workingHoursStart', restaurantData.workingHoursStart);
        if (restaurantData.workingHoursEnd) formData.append('workingHoursEnd', restaurantData.workingHoursEnd);
        formData.append('listings', restaurantData.listings.toString());
        if (restaurantData.image) formData.append('image', restaurantData.image);

        const response = await axios.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// Get a Single Restaurant API Call
export const getSingleRestaurantAPI = async (restaurantId: number): Promise<Restaurant> => {
    const functionName = 'getSingleRestaurantAPI';
    const endpoint = `${GET_SINGLE_RESTAURANT_API_ENDPOINT}/${restaurantId}`;

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
export const getAllRestaurantsAPI = async (token: string): Promise<Restaurant[]> => {
    const functionName = 'getAllRestaurantsAPI';
    const endpoint = GET_ALL_RESTAURANTS_API_ENDPOINT;

    logRequest(functionName, endpoint, {});

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
};

// Delete Restaurant API Call
export const deleteRestaurantAPI = async (restaurantId: number, token: string) => {
    const functionName = 'deleteRestaurantAPI';
    const endpoint = `${DELETE_RESTAURANT_API_ENDPOINT}/${restaurantId}`;

    logRequest(functionName, endpoint, {restaurant_id: restaurantId});

    try {
        const response = await axios.delete(endpoint, {
            headers: {Authorization: `Bearer ${token}`},
        });
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// Get Listings API Call
export const getListingsAPI = async (params: {
    restaurant_id?: number;
    page?: number;
    per_page?: number;
}): Promise<{ success: boolean; data: Listing[]; pagination: any }> => {
    const functionName = 'getListingsAPI';
    const endpoint = GET_LISTINGS_API_ENDPOINT;

    logRequest(functionName, endpoint, params);

    try {
        const response = await axios.get(endpoint, {params});
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// Get Uploaded File API Call
export const getUploadedFileAPI = async (filename: string): Promise<Blob> => {
    const functionName = 'getUploadedFileAPI';
    const endpoint = `${GET_UPLOADED_FILE_API_ENDPOINT}/${filename}`;

    logRequest(functionName, endpoint, {});

    try {
        const response = await axios.get(endpoint, {
            responseType: 'blob', // Important for binary data
        });
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// ------------------------------------
// Cart API Functions
// ------------------------------------

// Get Cart Items API Call
export const getCartAPI = async (token: string): Promise<CartItem[]> => {
    const functionName = 'getCartAPI';
    const endpoint = GET_CART_API_ENDPOINT;

    logRequest(functionName, endpoint, {});

    try {
        const response = await axios.get(endpoint, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, endpoint, response.data);
        return response.data.cart;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// Add Item to Cart API Call
export const addToCartAPI = async (listingId: number, count: number, token: string) => {
    const functionName = 'addToCartAPI';
    const endpoint = ADD_TO_CART_API_ENDPOINT;
    const payload = {listing_id: listingId, count};

    logRequest(functionName, endpoint, payload);

    try {
        const response = await axios.post(endpoint, payload, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// Remove Item from Cart API Call
export const removeFromCartAPI = async (listingId: number, token: string) => {
    const functionName = 'removeFromCartAPI';
    const endpoint = REMOVE_FROM_CART_API_ENDPOINT;
    const payload = {listing_id: listingId};

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
};

// Update Cart Item Quantity API Call
export const updateCartAPI = async (listingId: number, count: number, token: string) => {
    const functionName = 'updateCartAPI';
    const endpoint = UPDATE_CART_API_ENDPOINT;
    const payload = {listing_id: listingId, count};

    logRequest(functionName, endpoint, payload);

    try {
        const response = await axios.put(endpoint, payload, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// ------------------------------------
// Favorites API Functions
// ------------------------------------

// Add to Favorites API Call
export const addToFavoritesAPI = async (restaurantId: number, token: string) => {
    const functionName = 'addToFavoritesAPI';
    const endpoint = `${API_BASE_URL}/v1/favorites`;
    const payload = {restaurant_id: restaurantId};

    logRequest(functionName, endpoint, payload);

    try {
        const response = await axios.post(endpoint, payload, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// Remove from Favorites API Call
export const removeFromFavoritesAPI = async (restaurantId: number, token: string) => {
    const functionName = 'removeFromFavoritesAPI';
    const endpoint = `${API_BASE_URL}/v1/favorites`;
    const payload = {restaurant_id: restaurantId};

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
};

// Get Favorites API Call
export const getFavoritesAPI = async (token: string): Promise<{ restaurant_id: number; restaurant_name: string }[]> => {
    const functionName = 'getFavoritesAPI';
    const endpoint = `${API_BASE_URL}/v1/favorites`;

    logRequest(functionName, endpoint, {});

    try {
        const response = await axios.get(endpoint, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, endpoint, response.data);
        return response.data.favorites;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

// ------------------------------------
// Search API Function
// ------------------------------------

// Search API Call
export const searchAPI = async (searchParams: {
    type: "restaurant" | "listing";
    query: string;
    restaurant_id?: number;
}): Promise<any> => { // Define a more specific type based on your needs
    const functionName = 'searchAPI';
    const endpoint = SEARCH_API_ENDPOINT;

    logRequest(functionName, endpoint, searchParams);

    try {
        const response = await axios.get(endpoint, {params: searchParams});
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};
