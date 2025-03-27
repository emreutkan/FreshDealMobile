import {RestaurantSearchResult} from "@/src/types/api/search/responses";
import {Restaurant} from "@/src/types/api/restaurant/model";
import {Listing} from "@/src/types/api/listing/model";
import {CartItem} from "@/src/types/api/cart/model";
import {Address} from "@/src/types/api/address/model";
import {Purchase} from "@/src/types/api/purchase/model";


export interface RestaurantSearchResults {
    results: RestaurantSearchResult[];

}


export interface PurchaseState {
    activeOrders: Purchase[];
    loadingActiveOrders: boolean;
    activeOrdersError: string | null;

    previousOrders: Purchase[];
    loadingPreviousOrders: boolean;
    previousOrdersError: string | null;
    previousOrdersPagination: {
        currentPage: number;
        totalPages: number;
        perPage: number;
        totalOrders: number;
        hasNext: boolean;
        hasPrev: boolean;
    };

    currentOrder: Purchase | null;
    loadingCurrentOrder: boolean;
    currentOrderError: string | null;

    creatingPurchase: boolean;
    createPurchaseError: string | null;
    lastCreatedPurchases: Purchase[] | null;

    restaurantPurchases: Purchase[];
    loadingRestaurantPurchases: boolean;
    restaurantPurchasesError: string | null;
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


export interface Pagination {
    total: number;
    pages: number;
    current_page: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
}

export interface CartState {
    cartItems: CartItem[];
    loading: boolean;
    isPickup: boolean,
    cartTotal: number,
    count: number,
    error: string | null;
}

export interface RestaurantState {
    restaurantsProximity: Restaurant[];
    restaurantsProximityStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    restaurantsProximityLoading: boolean;
    favoriteRestaurantsIDs: number[];
    favoritesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    favoritesLoading: boolean;
    radius: number;
    error: string | null;
    selectedRestaurant: Restaurant;
    selectedRestaurantListings: Listing[],
    selectedRestaurantListing: Listing | null;
    listingsLoading: boolean,
    listingsError: string | null;
    isPickup: boolean;
    pagination: Pagination | null;

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
    shouldNavigateToLanding: boolean;
    isAuthenticated: boolean;
    moneySaved: number;
    foodSaved: number;
    achievements: Achievement[];
    totalDiscountEarned: number;

}

export interface Achievement {
    id: number;
    name: string;
    icon: string;
    unlocked: boolean;
    discount_percentage?: number;
    earned_at?: string;
    description?: string;
}

