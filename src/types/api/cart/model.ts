export interface CartItem {
    /** The unique cart item identifier */
    id: number;
    /** The associated listing identifier */
    listing_id: number;
    /** The restaurant identifier the listing belongs to */
    restaurant_id: number;
    /** The title or name of the listing item */
    title: string;
    /** The price displayed for the listing item (could be original, pickup, or delivery price) */
    price: number;
    /** The quantity of this listing added to the cart */
    count: number;
    /** The timestamp when the item was added to the cart */
    added_at: string;
}