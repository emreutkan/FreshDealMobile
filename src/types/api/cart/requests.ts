export interface AddToCartPayload {
    /** The ID of the listing to add to the cart */
    listing_id: number;
    /** Number of items to add (defaults to 1 if not provided) */
    count?: number;
}

/**
 * Payload used when updating the quantity of an item in the cart.
 */
export interface UpdateCartItemPayload {
    /** The ID of the listing to update in the cart */
    listing_id: number;
    /** New quantity for the cart item. Use 0 to remove the item */
    count: number;
}