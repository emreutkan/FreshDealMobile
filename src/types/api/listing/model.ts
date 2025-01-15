export interface Listing {
    id: number;
    restaurant_id: number;
    title: string;
    description: string;
    image_url: string;
    original_price: number;
    pick_up_price: number;
    delivery_price: number;
    count: number;
    consume_within: any;
    available_for_delivery: boolean;
    available_for_pickup: boolean;
}