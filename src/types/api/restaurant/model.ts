import {RestaurantComment} from "@/src/types/api/purchase/model";

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
    maxDeliveryDistance: number | null;
    deliveryFee: number | null;
    minOrderAmount: number | null;
    comments?: RestaurantComment[];
}

export interface ProximityRestaurant extends Restaurant {
    distance_km: number;
}
