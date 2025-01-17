// src/types/store.ts - NEW FILE
import {AddressState, CartState, PurchaseState, RestaurantState, SearchState, UserState} from './states';

export interface RootState {
    user: UserState;
    address: AddressState;
    cart: CartState;
    restaurant: RestaurantState;
    search: SearchState;
    purchase: PurchaseState;
}

export type AppDispatch = any; // We'll type this properly after store is created