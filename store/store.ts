// store.ts

import {configureStore, createListenerMiddleware, TypedStartListening} from '@reduxjs/toolkit';
import userReducer, {getRestaurantsByProximity, setSelectedAddress} from './userSlice'; // Adjust the path as needed

// 1. Create the listener middleware without type parameters
const listenerMiddleware = createListenerMiddleware();

// 2. Configure the store and include the listener middleware
export const store = configureStore({
    reducer: {
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(listenerMiddleware.middleware),
});

// 3. Infer RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 4. Create a typed "start listening" method after types are defined
export const startUserListening = listenerMiddleware.startListening as TypedStartListening<RootState, AppDispatch>;

// 5. Set up the listener with enhanced logging
startUserListening({
    actionCreator: setSelectedAddress,
    effect: async (action, listenerApi) => {
        try {
            const state = listenerApi.getState();
            const {addresses, selectedAddressId} = state.user;

            const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);
            if (!selectedAddress) {
                console.warn('%c[Warning] Selected address not found.', 'color: orange;');
                return;
            }

            // Dispatch the thunk and await its result
            const resultAction = await listenerApi.dispatch(
                getRestaurantsByProximity({
                    latitude: Number(selectedAddress.latitude),
                    longitude: Number(selectedAddress.longitude),
                    radius: 100000, // Adjust the radius as needed
                })
            );

            // Check if the thunk was fulfilled or rejected
            if (getRestaurantsByProximity.fulfilled.match(resultAction)) {
                console.log('%c[Success] Restaurants fetched successfully.', 'color: green; font-weight: bold;');
            } else {
                console.error('%c[Error] Failed to fetch restaurants.', 'color: red; font-weight: bold;');
                if (resultAction.payload) {
                    console.error('%c[Error Details]', 'color: red; font-weight: bold;', resultAction.payload);
                }
            }
        } catch (error) {
            console.error('%c[Error] An unexpected error occurred in the listener.', 'color: red; font-weight: bold;', error);
        }
    },
});
