// src/types/store.ts
import {AddressState, CartState, ListingState, PurchaseState, RestaurantState, SearchState, UserState} from './states';

export type AppState = {
    user: UserState;
    address: AddressState;
    cart: CartState;
    restaurant: RestaurantState;
    listing: ListingState;
    search: SearchState;
    purchase: PurchaseState;
};