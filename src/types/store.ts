// src/types/store.ts
import {AddressState, CartState, ListingState, RestaurantState, SearchState, UserState} from './states';

export type AppState = {
    user: UserState;
    address: AddressState;
    cart: CartState;
    restaurant: RestaurantState;
    listing: ListingState;
    search: SearchState;
};