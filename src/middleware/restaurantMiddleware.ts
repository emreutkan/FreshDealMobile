// src/middleware/restaurantMiddleware.ts
import {Middleware} from '@reduxjs/toolkit';
import {setSelectedRestaurant} from "@/src/redux/slices/restaurantSlice";
import {getListingsThunk} from "@/src/redux/thunks/restaurantThunks";
import type {AppDispatch, RootState} from '@/src/types/store';

export const restaurantMiddleware: Middleware<
    {},
    RootState,
    AppDispatch
> = (store) => (next) => (action) => {
    const result = next(action);

    if (setSelectedRestaurant.match(action)) {
        const restaurantId = action.payload.id;
        (store.dispatch as AppDispatch)(getListingsThunk({
            restaurantId,
            page: 1,
            perPage: 10
        }));
    }

    return result;
};