import {createAsyncThunk} from "@reduxjs/toolkit";
import {CartItem} from "@/store/slices/cartSlice";
import {addToCartAPI, getUsersCartItemsAPI, removeFromCart, updateCartAPI} from "@/store/api/cartAPI";

export const fetchCart = createAsyncThunk<CartItem[], string>(
    'cart/fetchCart',
    async (token, {rejectWithValue}) => {
        try {
            return await getUsersCartItemsAPI(token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const addItemToCart = createAsyncThunk<CartItem, { listingId: number; count: number; token: string }>(
    'cart/addItemToCart',
    async ({listingId, count, token}, {rejectWithValue}) => {
        try {
            return await addToCartAPI(listingId, count, token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const removeItemFromCart = createAsyncThunk<string, { listingId: number; token: string }>(
    'cart/removeItemFromCart',
    async ({listingId, token}, {rejectWithValue}) => {
        try {
            await removeFromCart(listingId, token);
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
