import {RestaurantSearchResult} from "@/src/types/api/search/responses";
import {Comment, RecentRestaurant, Restaurant} from "@/src/types/api/restaurant/model";
import {Listing} from "@/src/types/api/listing/model";
import {CartItem} from "@/src/types/api/cart/model";
import {Address} from "@/src/types/api/address/model";
import {Purchase} from "@/src/types/api/purchase/model";
import {UserRankResponse} from "@/src/redux/api/userAPI";

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

export interface CommentAnalysis {
    restaurant_id: number;
    restaurant_name: string;
    comment_count: number;
    analysis_date: string;
    good_aspects: string[];
    bad_aspects: string[];
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
    commentAnalysis: CommentAnalysis | null;
    commentAnalysisLoading: boolean;
    commentAnalysisError: string | null;
    recentRestaurants: RecentRestaurant[];
    recentRestaurantsLoading: boolean;
    recentRestaurantsError: string | null;
    comments: Comment[];
    commentsLoading: boolean;
    commentsError: string | null;
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
    achievementsLoading: boolean;
    totalDiscountEarned: number;
    userId: number;
    rank: number;
    totalDiscount: number;
    rankLoading: boolean;
    rankings: UserRankResponse[];
    rankingsLoading: boolean;
}

export interface Achievement {
    id: number;
    name: string;
    achievement_type: string;
    badge_image_url: string;
    description: string;
    earned_at?: string;
    threshold?: number;
    unlocked?: boolean;
    discount_percentage?: number;
}

export interface UserRank {
    rank: number;
    total_discount: number;
    user_id: number;
    user_name: string;
}