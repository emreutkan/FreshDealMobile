// src/types/store.ts - NEW FILE
import {AddressState, CartState, PurchaseState, RestaurantState, SearchState, UserState} from './states';
import {NotificationState} from "@/src/redux/slices/notificationSlice";
import {ReportState} from "@/src/redux/slices/reportSlice";


export interface RootState {
    notification: NotificationState;
    user: UserState;
    address: AddressState;
    cart: CartState;
    restaurant: RestaurantState;
    search: SearchState;
    purchase: PurchaseState;
    report: ReportState
}

export type AppDispatch = any; 