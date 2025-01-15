export interface RestaurantSearchResult {
    id: number;
    name: string;
    description: string;
    image_url: string;
    rating: number | null;
    category: string;
}


export interface ListingSearchResult {
    id: number;
    restaurant_id: number;
    title: string;
    description: string;
    image_url: string;
    price: number;
    count: number;
}


export interface SearchResponse<T> {
    success: boolean;
    type: string;
    results: T[];
}

