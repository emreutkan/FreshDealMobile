import axios from "axios";
import {logError, logRequest, logResponse} from "@/src/utils/logger";
import {API_BASE_URL} from "@/src/redux/api/API";
import {CartItem,} from "@/src/types/api/cart/model";
import {CartOperationResponse, CartResponse} from "@/src/types/api/cart/responses";
import {AddToCartPayload, UpdateCartItemPayload} from "@/src/types/api/cart/requests";

const CART_ENDPOINT = `${API_BASE_URL}/cart`;

/**
 * Get the current user's cart items.
 */
export const getUsersCartItemsAPI = async (token: string): Promise<CartItem[]> => {
    const functionName = "getCartAPI";

    logRequest(functionName, CART_ENDPOINT, {});

    try {
        const response = await axios.get<CartResponse>(CART_ENDPOINT, {
            headers: {Authorization: `Bearer ${token}`},
        });
        logResponse(functionName, CART_ENDPOINT, response.data);
        // Return the array of CartItem objects
        return response.data.cart;
    } catch (error: any) {
        logError(functionName, CART_ENDPOINT, error);
        throw error;
    }
};

/**
 * Add an item to the cart.
 */
export const addToCartAPI = async (payload: AddToCartPayload, token: string): Promise<CartOperationResponse> => {
    const functionName = "addToCartAPI";

    logRequest(functionName, CART_ENDPOINT, payload);

    try {
        const response = await axios.post<CartOperationResponse>(CART_ENDPOINT, payload, {
            headers: {Authorization: `Bearer ${token}`},
        });
        logResponse(functionName, CART_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, CART_ENDPOINT, error);
        throw error;
    }
};

/**
 * Update the quantity of a cart item.
 */
export const updateCartAPI = async (payload: UpdateCartItemPayload, token: string): Promise<CartOperationResponse> => {
    const functionName = "updateCartAPI";

    logRequest(functionName, CART_ENDPOINT, payload);

    try {
        const response = await axios.put<CartOperationResponse>(CART_ENDPOINT, payload, {
            headers: {Authorization: `Bearer ${token}`},
        });
        logResponse(functionName, CART_ENDPOINT, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, CART_ENDPOINT, error);
        throw error;
    }
};

/**
 * Remove an item from the cart.
 */
export const removeFromCart = async (listing_id: number, token: string): Promise<CartOperationResponse> => {
    const functionName = "removeFromCartAPI";
    const endpoint = `${CART_ENDPOINT}/${listing_id}`;
    const payload = {listing_id};

    logRequest(functionName, endpoint, payload);

    try {
        const response = await axios.delete<CartOperationResponse>(endpoint, {
            headers: {Authorization: `Bearer ${token}`},
            data: payload, // sending payload via data
        });
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};

/**
 * Reset the user's cart (remove all items).
 */
export const resetCartAPI = async (token: string): Promise<CartOperationResponse> => {
    const functionName = "resetCartAPI";
    const endpoint = `${CART_ENDPOINT}/reset`;

    logRequest(functionName, endpoint, {});

    try {
        const response = await axios.post<CartOperationResponse>(endpoint, {}, {
            headers: {Authorization: `Bearer ${token}`},
        });
        logResponse(functionName, endpoint, response.data);
        return response.data;
    } catch (error: any) {
        logError(functionName, endpoint, error);
        throw error;
    }
};
