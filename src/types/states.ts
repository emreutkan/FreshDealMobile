import {RestaurantSearchResult} from "@/src/types/api/search/responses";
import {Restaurant} from "@/src/types/api/restaurant/model";
import {Pagination} from "@/src/redux/slices/listingSlice";
import {Listing} from "@/src/types/api/listing/model";
import {CartItem} from "@/src/types/api/cart/model";
import {Address} from "@/src/types/api/address/model";

export interface RestaurantSearchResults {
    results: RestaurantSearchResult[];

}

export interface SearchState {
    searchResults: RestaurantSearchResults;
    loading: boolean;
    error: string | null;
}

export interface AddressState {
    addresses: Address[];
    selectedAddressId: string | null;
    loading: boolean;
    error: string | null;
}

export interface CartState {
    cartItems: CartItem[];
    loading: boolean;
    error: string | null;
}

export interface ListingState {
    listings: Listing[];
    loading: boolean;
    error: string | null;
    pagination: Pagination | null;
}

export interface RestaurantState {
    restaurantsProximity: Restaurant[];
    restaurantsProximityStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    restaurantsProximityLoading: boolean;
    favoriteRestaurantsIDs: number[];
    favoritesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    favoritesLoading: boolean;
    error: string | null;
}

export interface UserState {
    email: string;
    name_surname: string;
    selectedCode: string;
    phoneNumber: string;
    password: string;
    passwordLogin: boolean;
    verificationCode: string;
    step: "send_code" | "verify_code" | "skip_verification";
    login_type: "email" | "phone_number";
    token: string | null;
    loading: boolean;
    error: string | null;
    role: 'customer';
    email_verified: boolean
    isInitialized: boolean;

}

export interface RootState {
    user: UserState;
    address: AddressState;
    cart: CartState;
    restaurant: RestaurantState;
    listing: ListingState;
    search: SearchState;
    auth: AuthState; // This was missing and causing the error
}

export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}