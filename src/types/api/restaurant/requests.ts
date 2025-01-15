export interface CreateRestaurantPayload {
    restaurantName: string;
    restaurantDescription?: string;
    longitude: number;
    latitude: number;
    category: string;
    workingDays?: string[]; // Array of working days
    workingHoursStart?: string;
    workingHoursEnd?: string;
    listings?: number;
    pickup?: "true" | "false";
    delivery?: "true" | "false";
    maxDeliveryDistance?: number;
    deliveryFee?: number;
    minOrderAmount?: number;
    // For image uploads, you'll typically use FormData with a File object.
    image?: File;
}

export interface GetRestaurantsProximityPayload {
    latitude: number;
    longitude: number;
    radius?: number; // in km, defaults to 10 if not provided
}


// for owners
