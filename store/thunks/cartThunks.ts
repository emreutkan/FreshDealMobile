// Thunks

// Fetch Cart Items
import {createAsyncThunk} from "@reduxjs/toolkit";
import {addToCartAPI, getCartAPI, removeFromCartAPI, updateCartAPI} from "@/api/userAPI";
import {CartItem} from "@/store/slices/cartSlice";

export const fetchCart = createAsyncThunk<CartItem[], string>(
    'cart/fetchCart',
    async (token, {rejectWithValue}) => {
        try {
            return await getCartAPI(token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Add Item to Cart
export const addItemToCart = createAsyncThunk<CartItem, { listingId: number; count: number; token: string }>(
    'cart/addItemToCart',
    async ({listingId, count, token}, {rejectWithValue}) => {
        try {
            // Assuming the API returns the added/updated cart item
            return await addToCartAPI(listingId, count, token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Remove Item from Cart
export const removeItemFromCart = createAsyncThunk<string, { listingId: number; token: string }>(
    'cart/removeItemFromCart',
    async ({listingId, token}, {rejectWithValue}) => {
        try {
            await removeFromCartAPI(listingId, token);
            return listingId.toString();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update Cart Item Quantity
export const updateCartItem = createAsyncThunk<CartItem, { listingId: number; count: number; token: string }>(
    'cart/updateCartItem',
    async ({listingId, count, token}, {rejectWithValue}) => {
        try {
            // Assuming the API returns the updated cart item
            return await updateCartAPI(listingId, count, token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
