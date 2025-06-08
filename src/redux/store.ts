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
import notificationReducer from '@/src/redux/slices/notificationSlice';
import reportReducer from '@/src/redux/slices/reportSlice';
import recommendationReducer from '@/src/redux/slices/recommendationSlice';
import punishmentHistorySlice from '@/src/redux/slices/PunishmentHistorySlice';
import globalFiltersReducer, {GlobalFiltersState} from './slices/globalFiltersSlice'; // Import GlobalFiltersState

const store = configureStore({
    reducer: {
        user: userReducer,
        address: addressReducer,
        cart: cartReducer,
        restaurant: restaurantReducer,
        search: searchReducer,
        purchase: purchaseReducer,
        notification: notificationReducer,
        report: reportReducer,
        recommendation: recommendationReducer,
        punishmentHistory: punishmentHistorySlice,
        globalFilters: globalFiltersReducer, // Added reducer

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

// Ensure RootState includes GlobalFiltersState if not already defined in a separate types/store.ts
export interface RootStateFromStore {
    user: ReturnType<typeof userReducer>;
    address: ReturnType<typeof addressReducer>;
    cart: ReturnType<typeof cartReducer>;
    restaurant: ReturnType<typeof restaurantReducer>;
    search: ReturnType<typeof searchReducer>;
    purchase: ReturnType<typeof purchaseReducer>;
    notification: ReturnType<typeof notificationReducer>;
    report: ReturnType<typeof reportReducer>;
    recommendation: ReturnType<typeof recommendationReducer>;
    punishmentHistory: ReturnType<typeof punishmentHistorySlice>;
    globalFilters: GlobalFiltersState; // Add globalFilters here
}

// If you have a separate src/types/store.ts, ensure RootState there also includes globalFilters: GlobalFiltersState
// For now, this makes sure the type is known within this file at least.
export type RootState = ReturnType<typeof store.getState>;
