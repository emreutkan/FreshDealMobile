// src/types/store.ts - NEW FILE
import {AddressState, CartState, PurchaseState, RestaurantState, SearchState, UserState} from './states';
import {NotificationState} from "@/src/redux/slices/notificationSlice";


export interface RootState {
    notification: NotificationState;
    user: UserState;
    address: AddressState;
    cart: CartState;
    restaurant: RestaurantState;
    search: SearchState;
    purchase: PurchaseState;
}

export type AppDispatch = any; // We'll type this properly after store is created