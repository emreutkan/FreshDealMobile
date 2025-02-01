export interface RestaurantSearchResult {
    id: number;
    name: string;
    description: string;
    image_url: string;
    rating: number | null;
    category: string;
}


export interface SearchResponse<T> {
    success: boolean;
    type: string;
    results: T[];
}

