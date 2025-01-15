export interface PurchaseItem {
    purchase_id: number;
    listing_id: number;
    quantity: number;
    total_price: string;
    status: "pending" | "accepted" | "rejected" | "completed";
}


export interface RestaurantPurchase {
    id: number;
    user_id: number;
    listing_id: number;
    listing_title: string;
    quantity: number;
    total_price: string;
    purchase_date: string; // ISO string date-time
    status: "pending" | "accepted" | "rejected" | "completed";
    is_delivery: boolean;
    delivery_address: string;
    delivery_notes: string;
    completion_image_url?: string | null;
}


export interface Report {
    report_id: number;
    purchase_id: number;
    listing_id: number;
    restaurant_id: number;
    image_url: string;
    description: string;
    reported_at: string | null; // ISO date string or null
}

export interface RestaurantComment {
    id: number;
    user_id: number;
    comment: string;
    rating: number;
    timestamp: string; // ISO date string
}

