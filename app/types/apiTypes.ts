// // src/types/apiTypes.ts
//
// export interface CartItem {
//     id: number;
//     listing_id: number;
//     title: string;
//     price: number;
//     count: number;
//     added_at: string;
// }
//
// export interface Listing {
//     id: number;
//     restaurant_id: number;
//     title: string;
//     description: string;
//     image_url: string;
//     price: number;
//     count: number;
// }
//
// export interface Pagination {
//     total: number;
//     pages: number;
//     current_page: number;
//     per_page: number;
//     has_next: boolean;
//     has_prev: boolean;
// }
//
// export interface SearchResultRestaurant {
//     id: number;
//     name: string;
//     description: string;
//     image_url: string;
//     rating: number;
//     category: string;
// }
//
// export interface SearchResultListing {
//     restaurant_id: number;
//     title: string;
//     price: number;
//     count: number;
// }
//
// export type SearchResult = SearchResultRestaurant | SearchResultListing;
//
// export interface SearchResponse {
//     success: boolean;
//     type: "restaurant" | "listing";
//     results: SearchResult[];
// }
//
// export interface Restaurant {
//     id: number;
//     owner_id: number;
//     restaurantName: string;
//     restaurantDescription: string;
//     longitude: number;
//     latitude: number;
//     category: string;
//     workingDays: string[];
//     workingHoursStart: string;
//     workingHoursEnd: string;
//     listings: number;
//     rating: number;
//     ratingCount: number;
//     image_url: string;
// }
//
// export interface RestaurantCreateResponse {
//     success: boolean;
//     message: string;
//     image_url?: string;
// }
//
// export interface ListingCreateResponse {
//     success: boolean;
//     message: string;
//     image_url?: string;
// }
