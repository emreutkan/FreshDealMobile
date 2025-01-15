export interface AddToCartPayload {
    listing_id: number;
    count?: number; // Defaults to 1 if not provided
}

export interface UpdateCartItemPayload {
    listing_id: number;
    count: number;
}