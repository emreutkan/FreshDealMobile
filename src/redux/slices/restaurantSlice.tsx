// src/store/slices/restaurantSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getListingsThunk, getRestaurantsByProximity, getRestaurantThunk,} from '@/src/redux/thunks/restaurantThunks';

import {addFavoriteThunk, getFavoritesThunk, removeFavoriteThunk,} from "@/src/redux/thunks/userThunks";
import {Pagination, RestaurantState} from "@/src/types/states";
import {Restaurant} from "@/src/types/api/restaurant/model";
import {Listing} from "@/src/types/api/listing/model";

const emptyRestaurant: Restaurant = {
    id: 0,
    owner_id: 0,
    restaurantName: '',
    restaurantDescription: '',
    longitude: 0,
    latitude: 0,
    category: '',
    workingDays: [],
    workingHoursStart: '',
    workingHoursEnd: '',
    listings: 0,
    rating: null,
    ratingCount: 0,
    image_url: null,
    pickup: false,
    delivery: false,
    distance_km: null,
    maxDeliveryDistance: null,
    deliveryFee: null,
    minOrderAmount: null,
    comments: [],
};


const EmptyListing: Listing = {
    id: 0,
    title: '',
    description: '',
    original_price: 0,
    pick_up_price: 0,
    delivery_price: 0,
    count: 0,
    restaurant_id: 0,
    image_url: '',
    available_for_delivery: false,
    available_for_pickup: false,
    consume_within: 0,
}


const initialState: RestaurantState = {
    restaurantsProximity: [],
    restaurantsProximityStatus: 'idle',
    restaurantsProximityLoading: false,
    favoriteRestaurantsIDs: [],
    favoritesStatus: 'idle',
    favoritesLoading: false,
    radius: 50,
    error: null,
    selectedRestaurant: emptyRestaurant,
    selectedRestaurantListings: [],
    selectedRestaurantListing: EmptyListing,
    listingsLoading: false,
    listingsError: null,

    isPickup: true, // Default to pickup
    pagination: null,
};

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        setRadius(state, action: PayloadAction<number>) {
            state.radius = action.payload;
        },
        setSelectedRestaurant(state, action: PayloadAction<Restaurant>) {
            state.selectedRestaurant = action.payload;
            if (state.isPickup && !state.selectedRestaurant.pickup && state.selectedRestaurant.delivery) {
                state.isPickup = false;
            } else if (!state.isPickup && !state.selectedRestaurant.delivery && state.selectedRestaurant.pickup) {
                state.isPickup = true;
            }

        },
        setDeliveryMethod(state, action: PayloadAction<boolean>) {
            console.log("state.isPickup", state.isPickup);
            state.isPickup = action.payload;
            console.log("state.isPickup", state.isPickup);
        },
        clearSelectedRestaurant(state) {
            state.selectedRestaurant = emptyRestaurant;
            state.isPickup = true;
            state.selectedRestaurantListings = [];
            state.selectedRestaurantListing = EmptyListing;
        },
        setSelectedListing(state, action: PayloadAction<Listing>) {
            state.selectedRestaurantListing = action.payload;


        },
    },
    extraReducers: (builder) => {
        builder
            .addCase('user/logout', (state) => {
                return initialState;
            })
            .addCase(getRestaurantsByProximity.pending, (state) => {
                state.restaurantsProximityStatus = 'loading';
                state.restaurantsProximityLoading = true;
                state.error = null;
            })
            .addCase(getRestaurantsByProximity.fulfilled, (state, action) => {
                console.log("state before call", state.restaurantsProximity);

                state.restaurantsProximityStatus = 'succeeded';
                state.restaurantsProximityLoading = false;
                state.restaurantsProximity = action.payload;

            })
            .addCase(getRestaurantsByProximity.rejected, (state, action) => {
                state.restaurantsProximityStatus = 'failed';
                state.restaurantsProximityLoading = false;
                Object.assign(state, initialState);
                state.error = action.payload || 'Failed to fetch restaurants';
            })
            .addCase(getFavoritesThunk.pending, (state) => {
                state.favoritesStatus = 'loading';
                state.favoritesLoading = true;
                state.error = null;
            })
            .addCase(getFavoritesThunk.fulfilled, (state, action) => {
                state.favoritesStatus = 'succeeded';
                state.favoritesLoading = false;
                state.favoriteRestaurantsIDs = action.payload.favorites;
                console.log('Favorites:', action.payload);
            })
            .addCase(getFavoritesThunk.rejected, (state, action) => {
                state.favoritesStatus = 'failed';
                state.favoritesLoading = false;
                // state.error = action.payload || 'Failed to fetch favorites';
            })
            .addCase(addFavoriteThunk.pending, (state) => {
            })
            .addCase(addFavoriteThunk.fulfilled, (state, action) => {
            })
            .addCase(addFavoriteThunk.rejected, (state, action) => {
                state.error = action.payload || 'Failed to add to favorites';
            })
            .addCase(removeFavoriteThunk.pending, (state) => {
            })
            .addCase(removeFavoriteThunk.fulfilled, (state, action) => {
            })
            .addCase(removeFavoriteThunk.rejected, (state, action) => {
                state.error = action.payload || 'Failed to remove from favorites';
            })
            .addCase(getListingsThunk.pending, (state) => {
                state.listingsLoading = true;
                state.listingsError = null;
            })
            .addCase(getListingsThunk.fulfilled,
                (state, action: PayloadAction<{ listings: Listing[]; pagination: Pagination }>) => {
                    state.listingsLoading = false;
                    state.selectedRestaurantListings = action.payload.listings;
                    state.pagination = action.payload.pagination;
                })
            .addCase(getListingsThunk.rejected, (state, action) => {
                state.listingsLoading = false;
                state.listingsError = action.payload as string;
            })
            .addCase(getRestaurantThunk.fulfilled, (state, action: PayloadAction<Restaurant>) => {
                // TODO
                // this api is actually better to use when finding selected restaurant compared to filtering restaurants in proximity and searching the restaurant.id
                // but it's not implemented in the app
                // so I just use this to get the comments for now, will change that later though :)
                state.selectedRestaurant.comments = action.payload.comments || [];
            })
        ;
    },
});

export const {
    setRadius,
    setSelectedRestaurant,
    setDeliveryMethod,
    clearSelectedRestaurant,
    setSelectedListing,

} = restaurantSlice.actions;


export const selectDeliveryMethod = (state: { restaurant: RestaurantState }) => ({
    isPickup: state.restaurant.isPickup,

});
export default restaurantSlice.reducer;
