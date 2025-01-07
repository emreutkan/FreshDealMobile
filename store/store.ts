import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import addressReducer from './slices/addressSlice';
import cartReducer from './slices/cartSlice';
import restaurantReducer from './slices/restaurantSlice';

// Create the listener middleware

export const store = configureStore({
    reducer: {
        user: userReducer,
        address: addressReducer,
        cart: cartReducer,
        restaurant: restaurantReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

