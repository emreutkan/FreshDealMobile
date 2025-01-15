import {createAsyncThunk} from "@reduxjs/toolkit";
import {addToCartAPI, getUsersCartItemsAPI, removeFromCart, updateCartAPI} from "@/src/redux/api/cartAPI";
import {RootState} from "@/src/redux/store";
import {CartItem} from "@/src/types/api/cart/model";

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
    async ({listingId}, {dispatch, getState, rejectWithValue}) => {
        const token = getState().user.token;

        if (!token) {
            return rejectWithValue('Authentication token is missing.');
        }
        try {
            const response = await addToCartAPI(listingId, 1, token);

            await dispatch(fetchCart());
            return response;
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
    async ({listingId}, {dispatch, getState, rejectWithValue}) => {
        const token = getState().user.token;
        if (!token) {
            return rejectWithValue('Authentication token is missing.');
        }
        try {
            const response = await removeFromCart(listingId, token);
            await dispatch(fetchCart());
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update Cart Item Quantity
export const updateCartItem = createAsyncThunk<
    CartItem,
    { listingId: number; count: number; },
    { state: RootState; rejectValue: string }
>(
    'cart/updateCartItem',
    async ({listingId, count}, {dispatch, getState, rejectWithValue}) => {
        const token = getState().user.token;
        if (!token) {
            return rejectWithValue('Authentication token is missing.');
        }
        try {
            const response = await updateCartAPI(listingId, count, token);
            await dispatch(fetchCart());
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
