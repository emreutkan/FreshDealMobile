import {createSlice} from '@reduxjs/toolkit';
import {getFavorites, getRestaurantsByProximity} from "@/store/thunks/restaurantThunks";
import {logout} from "@/store/slices/userSlice";

export interface Restaurant {
    id: string;
    owner_id: number;
    restaurantName: string;
    restaurantDescription: string;
    longitude: number;
    latitude: number;
    category: string;
    workingDays: string[];
    workingHoursStart: string;
    workingHoursEnd: string;
    listings: number;
    rating: number;
    ratingCount: number;
    distance_km: number;
    image_url: string;
    pickup: boolean;
    delivery: boolean;
    maxDeliveryDistance: number; // in radius
    deliveryFee: number;
    minOrderAmount: number;

}

export interface RestaurantCreateResponse {
    success: boolean;
    message: string;
    image_url?: string;
}

interface RestaurantState {
    restaurantsProximity: Restaurant[];
    restaurantsProximityStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    restaurantsProximityLoading: boolean;
    favoriteRestaurantsIDs: string[];
    favoritesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    favoritesLoading: boolean;
    error: string | null;
}


const initialState: RestaurantState = {
    restaurantsProximity: [],
    restaurantsProximityStatus: 'idle',
    restaurantsProximityLoading: false,
    favoriteRestaurantsIDs: [],
    favoritesStatus: 'idle',
    favoritesLoading: false,
    error: null,
};

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(logout, () => initialState) // Reset state on global action

            // Restaurants by Proximity
            .addCase(getRestaurantsByProximity.pending, (state) => {
                state.restaurantsProximityStatus = 'loading';
                state.restaurantsProximityLoading = true;
                state.error = null;
            })
            .addCase(getRestaurantsByProximity.fulfilled, (state, action) => {
                state.restaurantsProximityStatus = 'succeeded';
                state.restaurantsProximityLoading = false;
                state.restaurantsProximity = action.payload;
            })
            .addCase(getRestaurantsByProximity.rejected, (state, action) => {
                state.restaurantsProximityStatus = 'failed';
                state.restaurantsProximityLoading = false;
                state.error = action.payload || 'Failed to fetch restaurants';
            })

            // Favorites
            .addCase(getFavorites.pending, (state) => {
                state.favoritesStatus = 'loading';
                state.favoritesLoading = true;
                state.error = null;
            })
            .addCase(getFavorites.fulfilled, (state, action) => {
                state.favoritesStatus = 'succeeded';
                state.favoritesLoading = false;
                state.favoriteRestaurantsIDs = action.payload; // Directly use the array of IDs
            })

            .addCase(getFavorites.rejected, (state, action) => {
                state.favoritesStatus = 'failed';
                state.favoritesLoading = false;
                state.error = action.payload || 'Failed to fetch favorites';
            });
    },
});

export default restaurantSlice.reducer;
