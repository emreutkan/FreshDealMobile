import {createAsyncThunk} from "@reduxjs/toolkit";
import {CartItem} from "@/src/redux/slices/cartSlice";
import {addToCartAPI, getUsersCartItemsAPI, removeFromCart, updateCartAPI} from "@/src/redux/api/cartAPI";
import {RootState} from "@/src/redux/store";

export const fetchCart = createAsyncThunk<
    CartItem[],
    void,
    { state: RootState; rejectValue: string }
>(
    'cart/fetchCart',
    async (_, {getState, rejectWithValue}) => {
        const token = getState().user.token;

        if (!token) {
            return rejectWithValue('Authentication token is missing.');
        }
        try {

            return await getUsersCartItemsAPI(token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const addItemToCart = createAsyncThunk<
    CartItem,
    { listingId: number },
    { state: RootState; rejectValue: string }

>(
    'cart/addItemToCart',
    async ({listingId}, {getState, rejectWithValue}) => {
        const token = getState().user.token;

        if (!token) {
            return rejectWithValue('Authentication token is missing.');
        }
        try {
            return await addToCartAPI(listingId, 1, token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const removeItemFromCart = createAsyncThunk<
    string,
    { listingId: number; },
    { state: RootState; rejectValue: string }
>(
    'cart/removeItemFromCart',
    async ({listingId}, {getState, rejectWithValue}) => {
        const token = getState().user.token;
        if (!token) {
            return rejectWithValue('Authentication token is missing.');
        }
        try {
            await removeFromCart(listingId, token);
            return listingId.toString();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update Cart Item Quantity
export const updateCartItem = createAsyncThunk<CartItem, { listingId: number; count: number; }>(
    'cart/updateCartItem',
    async ({listingId, count}, {rejectWithValue}) => {
        try {
            // Assuming the API returns the updated cart item
            return await updateCartAPI(listingId, count, token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
