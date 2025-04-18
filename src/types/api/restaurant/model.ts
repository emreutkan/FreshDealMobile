export interface Comment {
    id: number;
    user_id: number;
    comment: string;
    rating: number;
    timestamp: string;
    badges: {
        name: string;
        is_positive: boolean;
    }[];
}


export interface Restaurant {
    id: number;
    owner_id: number;
    restaurantName: string;
    restaurantDescription: string;
    longitude: number;
    latitude: number;
    category: string;
    workingDays: string[]; // parsed from comma-separated string
    workingHoursStart?: string;
    workingHoursEnd?: string;
    listings: number;
    rating: number | null;
    ratingCount: number;
    image_url: string | null;
    pickup: boolean;
    delivery: boolean;
    distance_km: number | null; // may cause problems remove if necessary
    maxDeliveryDistance: number | null;
    deliveryFee: number | null;
    minOrderAmount: number | null;
    comments?: Comment[];
    badges?: string[]; // Add this field


}

export interface RecentRestaurant {
    restaurant_id: number;
    restaurant_name: string;
    image_url: string;
    last_order_date: string;
}


