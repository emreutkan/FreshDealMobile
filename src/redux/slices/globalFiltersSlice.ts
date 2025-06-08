// filepath: C:\Users\emre\WebstormProjects\FreshDealMobile\src\redux\slices\globalFiltersSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// Correctly import RestaurantCategoryType
import {RestaurantCategoryType} from '@/src/types/api/restaurant/model';

interface GlobalFiltersState {
    showClosedRestaurants: boolean;
    // Replace deliveryOrPickup with separate flags
    showDelivery: boolean;
    showPickup: boolean;
    // Use RestaurantCategoryType here
    selectedCategory: RestaurantCategoryType | 'all';
}

const initialState: GlobalFiltersState = {
    showClosedRestaurants: true,
    // Both are enabled by default
    showDelivery: true,
    showPickup: true,
    selectedCategory: 'all',
};

const globalFiltersSlice = createSlice({
    name: 'globalFilters',
    initialState,
    reducers: {
        setShowClosedRestaurants(state, action: PayloadAction<boolean>) {
            state.showClosedRestaurants = action.payload;
        },
        // Replace with separate actions for delivery and pickup
        setShowDelivery(state, action: PayloadAction<boolean>) {
            state.showDelivery = action.payload;
        },
        setShowPickup(state, action: PayloadAction<boolean>) {
            state.showPickup = action.payload;
        },
        // Use RestaurantCategoryType in PayloadAction
        setSelectedCategory(state, action: PayloadAction<RestaurantCategoryType | 'all'>) {
            state.selectedCategory = action.payload;
        },
    },
});

export const {
    setShowClosedRestaurants,
    setShowDelivery,
    setShowPickup,
    setSelectedCategory,
} = globalFiltersSlice.actions;

export default globalFiltersSlice.reducer;

