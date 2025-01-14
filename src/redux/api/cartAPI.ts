import {CartItem} from "@/src/redux/slices/cartSlice";
import axios from "axios";

import {logError, logRequest, logResponse} from "@/src/utils/logger";
import {API_BASE_URL} from "@/src/redux/api/API";

const CART_ENDPOINT = `${API_BASE_URL}/cart`;

export const getUsersCartItemsAPI = async (token: string): Promise<CartItem[]> => {
    const functionName = 'getCartAPI';

    logRequest(functionName, CART_ENDPOINT, {});

    try {
        const response = await axios.get(CART_ENDPOINT, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, CART_ENDPOINT, response.data);
        return response.data.cart;
    } catch (error: any) {
        logError(functionName, CART_ENDPOINT, error);
        throw error;
    }
};

// Add Item to Cart API Call
export const addToCartAPI = async (listingId: number, count: number, token: string) => {
    const functionName = 'addToCartAPI';
    const payload = {listing_id: listingId, count};

    logRequest(functionName, CART_ENDPOINT, payload);

    try {
        const response = await axios.post(CART_ENDPOINT, payload, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, CART_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, CART_ENDPOINT, error);
        throw error;
    }
};


export const updateCartAPI = async (listingId: number, count: number, token: string) => {
    const functionName = 'updateCartAPI';
    const payload = {listing_id: listingId, count};

    logRequest(functionName, CART_ENDPOINT, payload);

    try {
        const response = await axios.put(CART_ENDPOINT, payload, {
            headers: {Authorization: `Bearer ${token}`}
        });
        logResponse(functionName, CART_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, CART_ENDPOINT, error);
        throw error;
    }
};

// Remove Item from Cart API Call
export const removeFromCart = async (listingId: number, token: string) => {
    const functionName = 'removeFromCartAPI';
    const endpoint = `${CART_ENDPOINT}/${listingId}`;
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