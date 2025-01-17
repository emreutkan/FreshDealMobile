// src/redux/store.ts
import {configureStore} from '@reduxjs/toolkit';
import userReducer from '@/src/redux/slices/userSlice';
import addressReducer from '@/src/redux/slices/addressSlice';
import cartReducer from '@/src/redux/slices/cartSlice';
import restaurantReducer from '@/src/redux/slices/restaurantSlice';
import searchReducer from '@/src/redux/slices/searchSlice';
import purchaseReducer from '@/src/redux/slices/purchaseSlice';
import {tokenMiddleware} from "@/src/middleware/tokenMiddleware";
import {restaurantMiddleware} from "@/src/middleware/restaurantMiddleware";

const store = configureStore({
    reducer: {
        user: userReducer,
        address: addressReducer,
        cart: cartReducer,
        restaurant: restaurantReducer,
        search: searchReducer,
        purchase: purchaseReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['user/setToken', 'user/logout'],
                ignoredActionPaths: ['payload.token'],
                ignoredPaths: ['user.token'],
            },
            thunk: true,
        }).concat(tokenMiddleware).concat(restaurantMiddleware)
});

export {store};
export type AppDispatch = typeof store.dispatch;