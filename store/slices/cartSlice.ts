// src/store/slices/cartSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {addItemToCart, fetchCart, removeItemFromCart, updateCartItem} from "@/store/thunks/cartThunks";
import {logout} from "@/store/slices/userSlice";


export interface CartItem {
    id: number;
    listing_id: number;
    title: string;
    price: number;
    count: number;
    added_at: string;
}

interface CartState {
    cartItems: CartItem[];
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    cartItems: [],
    loading: false,
    error: null,
};

// Slice

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Optional: Define synchronous actions if needed
        clearCart: (state) => {
            state.cartItems = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout, () => initialState) // Reset state on global action

        // Fetch Cart
        builder.addCase(fetchCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
            state.loading = false;
            state.cartItems = action.payload;
        });
        builder.addCase(fetchCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Add Item to Cart
        builder.addCase(addItemToCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addItemToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
            state.loading = false;
            const existingItem = state.cartItems.find(item => item.listing_id === action.payload.listing_id);
            if (existingItem) {
                existingItem.count += action.payload.count;
            } else {
                state.cartItems.push(action.payload);
            }
        });
        builder.addCase(addItemToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Remove Item from Cart
        builder.addCase(removeItemFromCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(removeItemFromCart.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.cartItems = state.cartItems.filter(item => item.id.toString() !== action.payload);
        });
        builder.addCase(removeItemFromCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update Cart Item
        builder.addCase(updateCartItem.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItem>) => {
            state.loading = false;
            const index = state.cartItems.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.cartItems[index] = action.payload;
            }
        });
        builder.addCase(updateCartItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const {clearCart} = cartSlice.actions;

export default cartSlice.reducer;
