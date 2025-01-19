import {createAsyncThunk} from "@reduxjs/toolkit";
import {addToCartAPI, getUsersCartItemsAPI, removeFromCart, resetCartAPI, updateCartAPI} from "@/src/redux/api/cartAPI";
import {RootState} from "@/src/types/store";
import {CartItem} from "@/src/types/api/cart/model";
import {CartOperationResponse} from "@/src/types/api/cart/responses";
import {AddToCartPayload, UpdateCartItemPayload} from "@/src/types/api/cart/requests";
import {tokenService} from "@/src/services/tokenService";

/**
 * Thunk to fetch the user's cart items.
 */
export const fetchCart = createAsyncThunk<
    CartItem[],
    void,
    { state: RootState; rejectValue: string }
>("cart/fetchCart", async (_, {getState, rejectWithValue}) => {
    const token = await tokenService.getToken();
    if (!token) {
        return rejectWithValue("Authentication token is missing.");
    }
    try {
        return await getUsersCartItemsAPI(token);
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

/**
 * Thunk to add an item to the cart.
 * Accepts a payload with listing_id and optionally a count (defaults to 1).
 */
export const addItemToCart = createAsyncThunk<
    CartOperationResponse,
    { payload: AddToCartPayload },
    { state: RootState; rejectValue: string }
>("cart/addItemToCart", async ({payload}, {dispatch, getState, rejectWithValue}) => {
    const token = await tokenService.getToken();
    if (!token) {
        return rejectWithValue("Authentication token is missing.");
    }
    try {
        const response = await addToCartAPI(payload, token);
        // Refresh the cart after adding
        await dispatch(fetchCart());
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

/**
 * Thunk to update the quantity of a cart item.
 */
export const updateCartItem = createAsyncThunk<
    CartOperationResponse,
    { payload: UpdateCartItemPayload },
    { state: RootState; rejectValue: string }
>("cart/updateCartItem", async ({payload}, {dispatch, getState, rejectWithValue}) => {
    const token = await tokenService.getToken();
    if (!token) {
        return rejectWithValue("Authentication token is missing.");
    }
    try {
        const response = await updateCartAPI(payload, token);
        // Refresh the cart after updating
        await dispatch(fetchCart());
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

/**
 * Thunk to remove an item from the cart.
 */
export const removeItemFromCart = createAsyncThunk<
    CartOperationResponse,
    { listing_id: number },
    { state: RootState; rejectValue: string }
>("cart/removeItemFromCart", async ({listing_id}, {dispatch, getState, rejectWithValue}) => {
    const token = await tokenService.getToken();
    if (!token) {
        return rejectWithValue("Authentication token is missing.");
    }
    try {
        const response = await removeFromCart(listing_id, token);
        await dispatch(fetchCart());
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

/**
 * Thunk to reset (empty) the user's cart.
 */
export const resetCart = createAsyncThunk<
    CartOperationResponse,
    void,
    { state: RootState; rejectValue: string }
>("cart/resetCart", async (_, {getState, rejectWithValue}) => {
    const token = await tokenService.getToken();
    if (!token) {
        return rejectWithValue("Authentication token is missing.");
    }
    try {
        return await resetCartAPI(token);
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});
