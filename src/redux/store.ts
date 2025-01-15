import {configureStore} from '@reduxjs/toolkit';
import userReducer from '@/src/redux/slices/userSlice';
import addressReducer from '@/src/redux/slices/addressSlice';
import cartReducer from '@/src/redux/slices/cartSlice';
import restaurantReducer from '@/src/redux/slices/restaurantSlice';
import listingReducer from '@/src/redux/slices/listingSlice';
import searchReducer from '@/src/redux/slices/searchSlice';
// Create the listener middleware

export const store = configureStore({
    reducer: {
        user: userReducer,
        address: addressReducer,
        cart: cartReducer,
        restaurant: restaurantReducer,
        listing: listingReducer,
        search: searchReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

