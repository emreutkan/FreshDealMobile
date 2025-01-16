// src/store/slices/cartSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {addItemToCart, fetchCart, removeItemFromCart, resetCart, updateCartItem} from "@/src/redux/thunks/cartThunks";
import {logout} from "@/src/redux/slices/userSlice";
import {CartState} from "@/src/types/states";
import {CartItem} from "@/src/types/api/cart/model";

const initialState: CartState = {
    cartItems: [],
    isPickup: true,
    cartTotal: 0,
    count: 0,
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Synchronous action to clear the cart
        clearCart: (state) => {
            state.cartItems = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // When logging out, reset the cart state to its initial state
            .addCase(logout, () => initialState)

            // ----------------------------
            // Fetch Cart Thunk
            // ----------------------------
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
                state.loading = false;
                state.cartItems = action.payload;
                console.log(state.cartItems)
                console.log(action.payload)
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ----------------------------
            // Add Item to Cart Thunk
            // ----------------------------
            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Since the addItemToCart thunk dispatches fetchCart, state will be updated in that reducer.
            // Optionally, you can update state here if your API returns a cart item.
            .addCase(addItemToCart.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ----------------------------
            // Update Cart Item Thunk
            // ----------------------------
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Similarly, fetchCart is dispatched after update
            .addCase(updateCartItem.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ----------------------------
            // Remove Item from Cart Thunk
            // ----------------------------
            .addCase(removeItemFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // After removal, fetchCart is dispatched so the state will be updated accordingly.
            .addCase(removeItemFromCart.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ----------------------------
            // Reset Cart Thunk
            // ----------------------------
            .addCase(resetCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetCart.fulfilled, (state) => {
                state.loading = false;
                // Clearing the cart after a reset
                state.cartItems = [];
            })
            .addCase(resetCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {clearCart} = cartSlice.actions;

export default cartSlice.reducer;
