// src/redux/store.ts
import {configureStore} from '@reduxjs/toolkit';
import userReducer from '@/src/redux/slices/userSlice';
import addressReducer from '@/src/redux/slices/addressSlice';
import cartReducer from '@/src/redux/slices/cartSlice';
import restaurantReducer from '@/src/redux/slices/restaurantSlice';
import listingReducer from '@/src/redux/slices/listingSlice';
import searchReducer from '@/src/redux/slices/searchSlice';
import purchaseReducer from '@/src/redux/slices/purchaseSlice';
import {tokenMiddleware} from "@/src/middleware/tokenMiddleware";


const store = configureStore({
    reducer: {
        user: userReducer,
        address: addressReducer,
        cart: cartReducer,
        restaurant: restaurantReducer,
        listing: listingReducer,
        search: searchReducer,
        purchase: purchaseReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['user/setToken', 'user/logout'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.token'],
                // Ignore these paths in the state
                ignoredPaths: ['user.token'],
            },
            thunk: true,
        }).concat(tokenMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {store};