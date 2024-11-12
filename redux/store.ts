// store.ts
import { configureStore } from '@reduxjs/toolkit';
// import userReducer from '../slices/userSlice'; // Create this file as shown below

export const store = configureStore({
    reducer: {
        // user: userReducer, // You can add more reducers here as your app grows
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
